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
    filters?: {
      minStatus?: number;
      maxStatus?: number;
      search?: string;
    },
  ): Promise<{ data: ApiError[]; nextCursor?: string; total: number }> {
    // Build count query (without cursor/take/pagination) for accurate total
    const countQuery = this.apiErrorRepository.createQueryBuilder('e');
    if (filters?.minStatus !== undefined) {
      countQuery.andWhere('e.statusCode >= :minStatus', { minStatus: filters.minStatus });
    }
    if (filters?.maxStatus !== undefined) {
      countQuery.andWhere('e.statusCode <= :maxStatus', { maxStatus: filters.maxStatus });
    }
    if (filters?.search) {
      countQuery.andWhere('(e.url ILIKE :search OR e.message ILIKE :search)', { search: `%${filters.search}%` });
    }
    const total = await countQuery.getCount();

    // Build data query with cursor and limit
    let query = this.apiErrorRepository
      .createQueryBuilder('e')
      .orderBy('e.createdAt', 'DESC')
      .addOrderBy('e.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      query = query.where('e.createdAt < :cursor', { cursor });
    }

    // Apply filters to data query
    if (filters?.minStatus !== undefined) {
      const cond = cursor ? 'andWhere' : 'where';
      query = query[cond]('e.statusCode >= :minStatus', { minStatus: filters.minStatus });
    }
    if (filters?.maxStatus !== undefined) {
      const cond = cursor || filters?.minStatus !== undefined ? 'andWhere' : 'where';
      query = query[cond]('e.statusCode <= :maxStatus', { maxStatus: filters.maxStatus });
    }
    if (filters?.search) {
      const cond = cursor || filters?.minStatus !== undefined || filters?.maxStatus !== undefined ? 'andWhere' : 'where';
      query = query[cond]('(e.url ILIKE :search OR e.message ILIKE :search)', { search: `%${filters.search}%` });
    }

    const results = await query.getMany();
    const hasMore = results.length > limit;

    const data = hasMore ? results.slice(0, limit) : results;
    const nextCursor = hasMore ? data[data.length - 1].createdAt.toISOString() : undefined;

    return { data, nextCursor, total };
  }

  async getStats(filters?: {
    minStatus?: number;
    maxStatus?: number;
    search?: string;
  }): Promise<{ total: number; byStatus: Record<string, number> }> {
    let qb = this.apiErrorRepository
      .createQueryBuilder('e')
      .select('e.statusCode', 'statusCode')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.statusCode')
      .orderBy('COUNT(*)', 'DESC');

    if (filters?.minStatus !== undefined) {
      qb = qb.andWhere('e.statusCode >= :minStatus', { minStatus: filters.minStatus });
    }
    if (filters?.maxStatus !== undefined) {
      qb = qb.andWhere('e.statusCode <= :maxStatus', { maxStatus: filters.maxStatus });
    }
    if (filters?.search) {
      qb = qb.andWhere('(e.url ILIKE :search OR e.message ILIKE :search)', { search: `%${filters.search}%` });
    }

    const stats = await qb.getRawMany();

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
