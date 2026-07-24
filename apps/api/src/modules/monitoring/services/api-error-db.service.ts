import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Between } from 'typeorm';
import { ApiError } from '../entities/api-error.entity';

@Injectable()
export class ApiErrorDbService {
  private readonly logger = new Logger(ApiErrorDbService.name);

  constructor(
    @InjectRepository(ApiError)
    private readonly apiErrorRepository: Repository<ApiError>,
  ) {}

  async create(error: {
    method: string;
    url: string;
    statusCode: number;
    message: string;
    stack?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ApiError> {
    return this.apiErrorRepository
      .save({
        method: error.method,
        url: error.url,
        statusCode: error.statusCode,
        message: error.message,
        stack: error.stack,
        ipAddress: error.ipAddress,
        userAgent: error.userAgent,
      })
      .catch((err) => {
        this.logger.error(`Failed to persist API error: ${err.message}`);
        throw err;
      });
  }

  async findRecent(
    limit: number = 20,
    cursor?: string,
  ): Promise<{ data: ApiError[]; nextCursor?: string; total: number }> {
    const total = await this.apiErrorRepository.count();

    let query = this.apiErrorRepository
      .createQueryBuilder('e')
      .orderBy('e.createdAt', 'DESC')
      .addOrderBy('e.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      // cursor-based pagination using ISO timestamp
      query = query.where('e.createdAt < :cursor', { cursor });
    }

    const results = await query.getMany();
    const hasMore = results.length > limit;

    const data = hasMore ? results.slice(0, limit) : results;
    const nextCursor = hasMore ? data[data.length - 1].createdAt.toISOString() : undefined;

    return { data, nextCursor, total };
  }

  async getStats(): Promise<{ total: number; byStatus: Record<string, number> }> {
    const stats = await this.apiErrorRepository
      .createQueryBuilder('e')
      .select('e.statusCode', 'statusCode')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.statusCode')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany();

    const byStatus: Record<string, number> = {};
    for (const row of stats) {
      byStatus[String(row.statusCode)] = parseInt(row.count, 10);
    }

    const total = Object.values(byStatus).reduce((sum, c) => sum + c, 0);
    return { total, byStatus };
  }

  async clear(): Promise<void> {
    await this.apiErrorRepository.clear();
  }
}
