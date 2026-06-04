import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Reservation, ReservationStatus } from '../entities/reservation.entity';
import { Passenger } from '../entities/passenger.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReservationsService {
  private redis: Redis;

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectQueue('reservations-queue') private readonly reservationsQueue: Queue,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async create(clientId: string, role: string, createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { tripId, passengers, type } = createReservationDto;

    // 1. Get Trip
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['bus'],
    });
    if (!trip) throw new NotFoundException('Voyage non trouvé');

    // 2. Check seat availability & lock (atomic operation simulation with Redis)
    for (const passenger of passengers) {
      const lockKey = `lock:trip:${tripId}:seat:${passenger.seatNumber}`;
      const isLocked = await this.redis.set(lockKey, clientId, 'EX', 600, 'NX'); // 10 minutes lock
      if (!isLocked) {
        throw new BadRequestException(`Le siège ${passenger.seatNumber} est déjà réservé ou verrouillé`);
      }
      
      // Also check DB for confirmed reservations
      const existing = await this.passengerRepository.findOne({
        where: {
          seatNumber: passenger.seatNumber,
          reservation: {
            tripId,
            status: ReservationStatus.CONFIRMED,
          },
        },
        relations: ['reservation'],
      });
      if (existing) {
        throw new BadRequestException(`Le siège ${passenger.seatNumber} est définitivement réservé`);
      }
    }

    // 3. Create Reservation in transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = this.reservationRepository.create({
        reservationCode: `OP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        tripId,
        clientId,
        agencyId: trip.agencyId,
        type,
        totalAmount: trip.basePrice * passengers.length,
        status: ReservationStatus.PENDING_PAYMENT,
        createdByRole: role,
      });

      const savedReservation = await queryRunner.manager.save(reservation);

      const passengerEntities = passengers.map(p => this.passengerRepository.create({
        ...p,
        reservationId: savedReservation.id,
      }));

      await queryRunner.manager.save(passengerEntities);

      await queryRunner.commitTransaction();

      // 4. Schedule expiration job (10 minutes)
      await this.reservationsQueue.add(
        'expire-reservation',
        { reservationId: savedReservation.id },
        { delay: 600000, removeOnComplete: true }
      );

      return savedReservation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // Unlock seats on error
      for (const passenger of passengers) {
        await this.redis.del(`lock:trip:${tripId}:seat:${passenger.seatNumber}`);
      }
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByClient(clientId: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { clientId },
      relations: ['trip', 'trip.route', 'trip.bus'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const res = await this.reservationRepository.findOne({
      where: { id },
      relations: ['trip', 'trip.route', 'trip.bus', 'agency'],
    });
    if (!res) throw new NotFoundException('Réservation non trouvée');
    return res;
  }
}
