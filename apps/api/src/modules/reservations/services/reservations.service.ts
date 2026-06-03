import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Reservation, ReservationStatus, ReservationType } from '../entities/reservation.entity';
import { Passenger } from '../entities/passenger.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UserRole } from '@opep/shared-types';

@Injectable()
export class ReservationsService {
  private readonly redis: Redis;

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Passenger)
    private readonly passengerRepo: Repository<Passenger>,
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async create(clientId: string, userRole: string, dto: CreateReservationDto): Promise<Reservation> {
    const trip = await this.tripRepo.findOne({
      where: { id: dto.tripId },
      relations: ['bus'],
    });

    if (!trip) throw new NotFoundException('Voyage introuvable');

    const seatNumbers = dto.passengers.map(p => p.seatNumber);
    
    // 1. Verrouillage Redis (Atomic SET NX)
    // On verrouille chaque siège pendant 10 minutes (temps pour payer)
    for (const seat of seatNumbers) {
      const lockKey = `lock:trip:${trip.id}:seat:${seat}`;
      const acquired = await this.redis.set(lockKey, clientId, 'EX', 600, 'NX');
      
      if (!acquired) {
        throw new ConflictException(`Le siège ${seat} est déjà en cours de réservation`);
      }
    }

    // 2. Vérification en base (sièges déjà confirmés)
    const existingPassenger = await this.passengerRepo.createQueryBuilder('p')
      .innerJoin('p.reservation', 'r')
      .where('r.tripId = :tripId', { tripId: trip.id })
      .andWhere('p.seatNumber IN (:...seats)', { seats: seatNumbers })
      .andWhere('r.status IN (:...statuses)', { 
        statuses: [ReservationStatus.CONFIRMED, ReservationStatus.PENDING_PAYMENT] 
      })
      .getOne();

    if (existingPassenger) {
      // Libérer les verrous si déjà pris en base
      await this.releaseSeats(trip.id, seatNumbers);
      throw new ConflictException(`Un ou plusieurs sièges sont déjà réservés`);
    }

    // 3. Création de la réservation (Transaction)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = queryRunner.manager.create(Reservation, {
        reservationCode: this.generateReservationCode(),
        tripId: trip.id,
        clientId,
        agencyId: trip.agencyId,
        type: dto.passengers.length > 1 ? ReservationType.GROUP : ReservationType.INDIVIDUAL,
        totalAmount: trip.basePrice * dto.passengers.length,
        status: ReservationStatus.PENDING_PAYMENT,
        createdByRole: userRole,
      });

      const savedReservation = await queryRunner.manager.save(reservation);

      const passengers = dto.passengers.map(p => queryRunner.manager.create(Passenger, {
        ...p,
        reservationId: savedReservation.id,
      }));

      await queryRunner.manager.save(passengers);
      await queryRunner.commitTransaction();

      return savedReservation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.releaseSeats(trip.id, seatNumbers);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async releaseSeats(tripId: string, seats: string[]) {
    const keys = seats.map(s => `lock:trip:${tripId}:seat:${s}`);
    await this.redis.del(...keys);
  }

  private generateReservationCode(): string {
    return `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  async findAllByClient(clientId: string): Promise<Reservation[]> {
    return this.reservationRepo.find({
      where: { clientId },
      relations: ['trip', 'trip.route'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, clientId: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({
      where: { id, clientId },
      relations: ['trip', 'trip.route', 'trip.bus'],
    });
    if (!res) throw new NotFoundException('Réservation introuvable');
    return res;
  }
}
