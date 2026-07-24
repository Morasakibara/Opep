import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ApiError } from '../entities/api-error.entity';

export interface ErrorFilters {
  minStatus?: number;
  maxStatus?: number;
  search?: string;
}

@Injectable()
export class ApiErrorDbService {
  private readonly logger = new Logger(ApiErrorDbService.name);

  constructor(
    @InjectRepository(ApiError)
    private readonly apiErrorRepository: Repository<ApiError>,
  ) {}

  /**
   * Apply common filters to a query builder.
   * Uses `andWhere` so it can be chained after any initial `where` clause.
   */
  private applyFilters(
    qb: SelectQueryBuilder<ApiError>,
    filters?: ErrorFilters,
  ): SelectQueryBuilder<ApiError> {
    if (!filters) return qb;
    if (filters.minStatus !== undefined) {
      qb.andWhere('e.statusCode >= :minStatus', { minStatus: filters.minStatus });
    }
    if (filters.maxStatus !== undefined) {
      qb.andWhere('e.statusCode <= :maxStatus', { maxStatus: filters.maxStatus });
    }
    if (filters.search) {
      qb.andWhere('(e.url ILIKE :search OR e.message ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }
    return qb;
  }

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
    filters?: ErrorFilters,
  ): Promise<{ data: ApiError[]; nextCursor?: string; total: number }> {
    // Count query (filters only, no cursor/pagination)
    const total = await this.applyFilters(
      this.apiErrorRepository.createQueryBuilder('e'),
      filters,
    ).getCount();

    // Data query with cursor and limit
    let query = this.apiErrorRepository
      .createQueryBuilder('e')
      .orderBy('e.createdAt', 'DESC')
      .addOrderBy('e.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      query = query.where('e.createdAt < :cursor', { cursor });
    }

    // Apply filters (uses andWhere internally, compatible with the cursor where)
    query = this.applyFilters(query, filters);

    const results = await query.getMany();
    const hasMore = results.length > limit;

    const data = hasMore ? results.slice(0, limit) : results;
    const nextCursor = hasMore ? data[data.length - 1].createdAt.toISOString() : undefined;

    return { data, nextCursor, total };
  }

  async getStats(filters?: ErrorFilters): Promise<{ total: number; byStatus: Record<string, number> }> {
    const stats = await this.applyFilters(
      this.apiErrorRepository
        .createQueryBuilder('e')
        .select('e.statusCode', 'statusCode')
        .addSelect('COUNT(*)', 'count')
        .groupBy('e.statusCode')
        .orderBy('COUNT(*)', 'DESC'),
      filters,
    ).getRawMany();

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
