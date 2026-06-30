import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from '../entities/trip.entity';
import { CreateTripDto } from '../dto/create-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async create(agencyId: string, createTripDto: CreateTripDto): Promise<Trip> {
    const trip = this.tripRepository.create({
      ...createTripDto,
      agencyId,
      departureDateTime: new Date(createTripDto.departureDateTime),
      arrivalDateTime: new Date(createTripDto.arrivalDateTime),
    });
    return this.tripRepository.save(trip);
  }

  async search(params: {
    departureCity?: string;
    arrivalCity?: string;
    date?: string;
    passengers?: number;
  }): Promise<Trip[]> {
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

    return query.getMany();
  }

  async findAll(agencyId: string): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { agencyId },
      relations: ['route', 'bus'],
    });
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

  async findAvailable(): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { status: TripStatus.SCHEDULED },
      relations: ['route', 'bus', 'agency'],
      order: { departureDateTime: 'ASC' },
    });
  }

  async remove(agencyId: string, id: string): Promise<void> {
    const trip = await this.findOne(agencyId, id);
    trip.status = TripStatus.CANCELLED;
    await this.tripRepository.save(trip);
  }
}
