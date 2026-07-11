import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Trip } from '../trips/entities/trip.entity';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(clientId: string, data: {
    tripId: string;
    agencyId: string;
    driverRating: number;
    comfortRating: number;
    comment?: string;
  }): Promise<Review> {
    // Validate ratings
    if (data.driverRating < 1 || data.driverRating > 5) {
      throw new BadRequestException('La note du chauffeur doit être entre 1 et 5');
    }
    if (data.comfortRating < 1 || data.comfortRating > 5) {
      throw new BadRequestException('La note du confort doit être entre 1 et 5');
    }

    // Check that the client actually completed this trip
    const reservation = await this.reservationRepository.findOne({
      where: {
        clientId,
        tripId: data.tripId,
        status: ReservationStatus.USED,
      },
    });

    if (!reservation) {
      throw new BadRequestException('Vous devez avoir effectué ce voyage pour laisser un avis');
    }

    // Check for duplicate review
    const existing = await this.reviewRepository.findOne({
      where: { tripId: data.tripId, clientId },
    });

    if (existing) {
      throw new BadRequestException('Vous avez déjà laissé un avis pour ce voyage');
    }

    const review = this.reviewRepository.create({
      ...data,
      clientId,
    });

    return this.reviewRepository.save(review);
  }

  async findByAgency(agencyId: string, paginationDto: PaginationDto): Promise<{ items: Review[]; total: number }> {
    const [items, total] = await this.reviewRepository.findAndCount({
      where: { agencyId, isPublic: true },
      relations: ['client', 'trip'],
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total };
  }

  async getAgencyAverageRating(agencyId: string): Promise<{
    averageDriverRating: number;
    averageComfortRating: number;
    totalReviews: number;
  }> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.driverRating)', 'avgDriver')
      .addSelect('AVG(review.comfortRating)', 'avgComfort')
      .addSelect('COUNT(review.id)', 'totalCount')
      .where('review.agencyId = :agencyId', { agencyId })
      .andWhere('review.isPublic = true')
      .getRawOne();

    return {
      averageDriverRating: parseFloat(result.avgDriver) || 0,
      averageComfortRating: parseFloat(result.avgComfort) || 0,
      totalReviews: parseInt(result.totalCount, 10) || 0,
    };
  }
}
