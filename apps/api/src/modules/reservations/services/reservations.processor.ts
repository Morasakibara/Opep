import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '../entities/reservation.entity';
import { Passenger } from '../entities/passenger.entity';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Processor('reservations-queue')
export class ReservationsProcessor extends WorkerHost {
  private redis: Redis;

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    private readonly configService: ConfigService,
  ) {
    super();
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'expire-reservation') {
      const { reservationId } = job.data;
      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
      });

      if (reservation && reservation.status === ReservationStatus.PENDING_PAYMENT) {
        // Cancel reservation
        reservation.status = ReservationStatus.EXPIRED;
        await this.reservationRepository.save(reservation);

        // Release Redis locks for seats
        const passengers = await this.passengerRepository.find({
          where: { reservationId },
        });

        for (const passenger of passengers) {
          const lockKey = `lock:trip:${reservation.tripId}:seat:${passenger.seatNumber}`;
          await this.redis.del(lockKey);
        }

        console.log(`[RESERVATION] Expirée: ${reservationId}`);
      }
    }
  }
}
