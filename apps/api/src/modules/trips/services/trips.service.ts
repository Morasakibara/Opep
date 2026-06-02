import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';
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
      .andWhere('trip.status = :status', { status: 'SCHEDULED' });

    return query.getMany();
  }
}
