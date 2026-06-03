import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from '../entities/trip.entity';
import { CreateTripDto } from '../dto/create-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';

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

  async findAll(agencyId: string, filters?: { status?: TripStatus }): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { agencyId, ...(filters?.status && { status: filters.status }) },
      relations: ['route', 'bus'],
      order: { departureDateTime: 'DESC' },
    });
  }

  async findOne(agencyId: string, id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id, agencyId },
      relations: ['route', 'bus'],
    });
    if (!trip) {
      throw new NotFoundException(`Le voyage avec l'ID ${id} est introuvable`);
    }
    return trip;
  }

  async update(agencyId: string, id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findOne(agencyId, id);
    
    if (updateTripDto.departureDateTime) {
      trip.departureDateTime = new Date(updateTripDto.departureDateTime);
    }
    if (updateTripDto.arrivalDateTime) {
      trip.arrivalDateTime = new Date(updateTripDto.arrivalDateTime);
    }
    
    Object.assign(trip, {
      ...updateTripDto,
      departureDateTime: trip.departureDateTime,
      arrivalDateTime: trip.arrivalDateTime,
    });

    return this.tripRepository.save(trip);
  }

  async remove(agencyId: string, id: string): Promise<void> {
    const trip = await this.findOne(agencyId, id);
    trip.status = TripStatus.CANCELLED;
    await this.tripRepository.save(trip);
  }

  async search(params: {
    departureCity: string;
    arrivalCity: string;
    date: string;
    passengers: number;
  }): Promise<Trip[]> {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.route', 'route')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.agency', 'agency')
      .where('route.departureCity = :departureCity', { departureCity: params.departureCity })
      .andWhere('route.arrivalCity = :arrivalCity', { arrivalCity: params.arrivalCity })
      .andWhere('DATE(trip.departureDateTime) = :date', { date: params.date })
      .andWhere('trip.status = :status', { status: TripStatus.SCHEDULED });

    return query.getMany();
  }
}
