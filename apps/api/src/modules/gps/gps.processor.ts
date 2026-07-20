import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GpsPing } from './entities/gps-ping.entity';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';

@Processor('gps-queue')
export class GpsProcessor extends WorkerHost {
  private readonly logger = new Logger(GpsProcessor.name);

  constructor(
    @InjectRepository(GpsPing)
    private readonly gpsPingRepository: Repository<GpsPing>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'persist-gps-checkpoint') {
      return this.persistCheckpoint(job.data.tripId);
    }
    this.logger.warn(`Job inconnu : ${job.name}`);
  }

  /**
   * Persiste un point GPS depuis le cache Redis vers la base de données.
   * Appelé toutes les ~2 minutes par voyage actif via un job planifié.
   */
  private async persistCheckpoint(tripId: string) {
    const cacheKey = `trip_gps:${tripId}`;
    const lastPosition = await this.redis.get(cacheKey);

    if (!lastPosition) {
      this.logger.warn(`Aucune position en cache pour le voyage ${tripId}`);
      return { tripId, persisted: false, reason: 'no_cache_data' };
    }

    try {
      const parsed = JSON.parse(lastPosition);

      const ping = new GpsPing();
      ping.tripId = tripId;
      ping.latitude = parsed.latitude;
      ping.longitude = parsed.longitude;
      ping.speed = parsed.speed || parsed.speedKmh || 0;
      ping.recordedAt = new Date(parsed.recordedAt || Date.now());

      await this.gpsPingRepository.save(ping);
      this.logger.log(`Point GPS persisté pour le voyage ${tripId}`);

      return { tripId, persisted: true };
    } catch (error: any) {
      this.logger.error(`Erreur persistance GPS voyage ${tripId}: ${error.message}`);
      return { tripId, persisted: false, error: error.message };
    }
  }
}
