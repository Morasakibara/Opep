import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Seat, SeatStatus } from '../entities/seat.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { CreateSeatDto } from '../dto/create-seat.dto';
import { LockSeatsDto, UnlockSeatsDto } from '../dto/lock-seats.dto';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateSeatDto): Promise<Seat> {
    const trip = await this.tripRepository.findOne({ where: { id: dto.tripId } });
    if (!trip) throw new NotFoundException('Voyage non trouvé');

    const existing = await this.seatRepository.findOne({
      where: { tripId: dto.tripId, seatNumber: dto.seatNumber },
    });
    if (existing) throw new ConflictException('Ce siège existe déjà pour ce voyage');

    const seat = this.seatRepository.create({
      tripId: dto.tripId,
      seatNumber: dto.seatNumber,
      isWindow: dto.isWindow ?? false,
      isAisle: dto.isAisle ?? false,
      rowNumber: dto.rowNumber ?? 1,
      colLetter: dto.colLetter ?? 'A',
    });

    return this.seatRepository.save(seat);
  }

  async bulkCreate(tripId: string, totalSeats: number, cols: number): Promise<Seat[]> {
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Voyage non trouvé');

    const rows = Math.ceil(totalSeats / cols);
    const seats: Seat[] = [];

    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        const colLetter = String.fromCharCode(65 + c);
        const seatNumber = `${r}${colLetter}`;
        const isWindow = c === 0 || c === cols - 1;
        const isAisle = cols <= 4 ? c === Math.floor(cols / 2) - 1 || c === Math.floor(cols / 2) : false;

        const seat = this.seatRepository.create({
          tripId,
          seatNumber,
          isWindow,
          isAisle,
          rowNumber: r,
          colLetter,
        });
        seats.push(seat);
      }
    }

    return this.seatRepository.save(seats);
  }

  async findByTrip(tripId: string): Promise<Seat[]> {
    return this.seatRepository.find({
      where: { tripId },
      order: { rowNumber: 'ASC', colLetter: 'ASC' },
    });
  }

  async findAvailableByTrip(tripId: string): Promise<Seat[]> {
    return this.seatRepository.find({
      where: { tripId, status: SeatStatus.AVAILABLE },
      order: { rowNumber: 'ASC', colLetter: 'ASC' },
    });
  }

  async lockSeats(dto: LockSeatsDto): Promise<Seat[]> {
    const seats = await this.seatRepository.find({
      where: { id: In(dto.seatIds) },
    });

    if (seats.length !== dto.seatIds.length) {
      throw new NotFoundException('Certains sièges sont introuvables');
    }

    const now = new Date();
    const updated: Seat[] = [];

    for (const seat of seats) {
      if (seat.status !== SeatStatus.AVAILABLE) {
        throw new ConflictException(
          `Le siège ${seat.seatNumber} n'est pas disponible (${seat.status})`,
        );
      }

      seat.status = SeatStatus.RESERVED;
      seat.lockedBy = dto.lockedBy;
      seat.lockedAt = now;
      updated.push(await this.seatRepository.save(seat));
    }

    return updated;
  }

  async unlockSeats(dto: UnlockSeatsDto): Promise<void> {
    await this.seatRepository.update(
      { id: In(dto.seatIds) },
      {
        status: SeatStatus.AVAILABLE,
        lockedBy: null,
        lockedAt: null,
        reservationId: null,
        passengerId: null,
      },
    );
  }

  async assignToReservation(
    seatIds: string[],
    reservationId: string,
    passengerId: string,
  ): Promise<Seat[]> {
    const seats = await this.seatRepository.find({
      where: { id: In(seatIds) },
    });

    const updated: Seat[] = [];
    for (const seat of seats) {
      seat.status = SeatStatus.OCCUPIED;
      seat.reservationId = reservationId;
      seat.passengerId = passengerId;
      seat.lockedBy = null;
      seat.lockedAt = null;
      updated.push(await this.seatRepository.save(seat));
    }

    return updated;
  }

  async releaseByReservation(reservationId: string): Promise<void> {
    await this.seatRepository.update(
      { reservationId },
      {
        status: SeatStatus.AVAILABLE,
        lockedBy: null,
        lockedAt: null,
        reservationId: null,
        passengerId: null,
      },
    );
  }

  async remove(id: string): Promise<void> {
    const seat = await this.seatRepository.findOne({ where: { id } });
    if (!seat) throw new NotFoundException('Siège non trouvé');
    await this.seatRepository.remove(seat);
  }
}
