import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from '../entities/trip.entity';
import { CreateTripDto } from '../dto/create-trip.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async create(agencyId: string, centreId: string | undefined, createTripDto: CreateTripDto): Promise<Trip> {
    const trip = this.tripRepository.create({
      ...createTripDto,
      agencyId,
      centreId: centreId ?? undefined,
      departureDateTime: new Date(createTripDto.departureDateTime),
      arrivalDateTime: new Date(createTripDto.arrivalDateTime),
    });
    return this.tripRepository.save(trip);
  }

  async search(
    params: {
      departureCity?: string;
      arrivalCity?: string;
      date?: string;
      passengers?: number;
    },
    paginationDto: PaginationDto,
  ): Promise<{ items: Trip[]; total: number }> {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.route', 'route')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.agency', 'agency')
      .where('trip.status = :status', { status: 'SCHEDULED' });

    if (params.departureCity) {
      query.andWhere('route.departureCity = :departureCity', { departureCity: params.departureCity });
    }
    if (params.arrivalCity) {
      query.andWhere('route.arrivalCity = :arrivalCity', { arrivalCity: params.arrivalCity });
    }
    if (params.date) {
      query.andWhere('DATE(trip.departureDateTime) = :date', { date: params.date });
    }

    const [items, total] = await query
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { items, total };
  }

  async findAll(agencyId: string, paginationDto: PaginationDto): Promise<{ items: Trip[]; total: number }> {
    const [items, total] = await this.tripRepository.findAndCount({
      where: { agencyId },
      relations: ['route', 'bus'],
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: paginationDto.sortOrder || 'DESC' },
    });
    return { items, total };
  }

  async findOne(agencyId: string, id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id, agencyId },
      relations: ['route', 'bus'],
    });
    if (!trip) throw new NotFoundException('Voyage non trouvé');
    return trip;
  }

  async update(agencyId: string, id: string, updateTripDto: any): Promise<Trip> {
    const trip = await this.findOne(agencyId, id);
    Object.assign(trip, updateTripDto);
    return this.tripRepository.save(trip);
  }

  async findAvailable(paginationDto: PaginationDto): Promise<{ items: Trip[]; total: number }> {
    const [items, total] = await this.tripRepository.findAndCount({
      where: { status: TripStatus.SCHEDULED },
      relations: ['route', 'bus', 'agency'],
      order: { departureDateTime: 'ASC' },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });
    return { items, total };
  }

  async updateStatus(agencyId: string, id: string, status: TripStatus): Promise<Trip> {
    const trip = await this.findOne(agencyId, id);
    if (trip.status !== TripStatus.SCHEDULED) {
      throw new BadRequestException('Seuls les voyages planifiés (SCHEDULED) peuvent être modifiés');
    }
    trip.status = status;
    return this.tripRepository.save(trip);
  }

  async getSeats(agencyId: string, id: string): Promise<{
    totalSeats: number;
    occupiedSeats: string[];
    lockedSeats: string[];
    availableSeats: number;
    seatLayout: any;
  }> {
    const trip = await this.tripRepository.findOne({
      where: { id, agencyId },
      relations: ['bus'],
    });
    if (!trip) throw new NotFoundException('Voyage non trouvé');

    // Get confirmed/pending reservations for this trip
    const reservations = await this.tripRepository.manager
      .createQueryBuilder()
      .select('DISTINCT passenger.seatNumber', 'seatNumber')
      .from('passengers', 'passenger')
      .innerJoin('reservations', 'reservation', 'reservation.id = passenger.reservationId')
      .where('reservation.tripId = :tripId', { tripId: id })
      .andWhere('reservation.status IN (:...statuses)', { statuses: ['CONFIRMED', 'PENDING_PAYMENT'] })
      .getRawMany();

    const occupiedSeats = reservations.map(r => r.seatNumber);
    
    return {
      totalSeats: trip.bus.totalSeats,
      occupiedSeats,
      lockedSeats: [], // Locked seats would need Redis scan - simplified
      availableSeats: trip.bus.totalSeats - occupiedSeats.length,
      seatLayout: trip.bus.seatLayout,
    };
  }

  async remove(agencyId: string, id: string): Promise<void> {
    const trip = await this.findOne(agencyId, id);
    trip.status = TripStatus.CANCELLED;
    await this.tripRepository.save(trip);
  }
}
