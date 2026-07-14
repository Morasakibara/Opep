import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '../entities/reservation.entity';
import { Passenger } from '../entities/passenger.entity';
import Redis from 'ioredis';
import { Inject, Logger } from '@nestjs/common';
import { REDIS_CLIENT } from '../../../common/redis/redis.module';

@Processor('reservations-queue')
export class ReservationsProcessor extends WorkerHost {
  private readonly logger = new Logger(ReservationsProcessor.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    super();
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

        this.logger.log(`Expirée: ${reservationId}`);
      }
    }
  }
}
