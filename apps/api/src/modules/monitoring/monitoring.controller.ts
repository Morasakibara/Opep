import { Controller, Get, Post, Delete, Query } from '@nestjs/common';
import { ErrorStoreService } from '../../common/filters/error-store.service';
import { ApiErrorDbService } from './services/api-error-db.service';
import { MONITORING_SEED_ERRORS } from './seed-data';

@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly errorStore: ErrorStoreService,
    private readonly apiErrorDb: ApiErrorDbService,
  ) {}

  @Get('errors')
  async getRecentErrors(
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('minStatus') minStatus?: string,
    @Query('maxStatus') maxStatus?: string,
    @Query('search') search?: string,
  ) {
    const filters = {
      ...(minStatus !== undefined ? { minStatus: parseInt(minStatus, 10) } : {}),
      ...(maxStatus !== undefined ? { maxStatus: parseInt(maxStatus, 10) } : {}),
      ...(search ? { search } : {}),
    };
    return this.apiErrorDb.findRecent(
      limit ? parseInt(limit, 10) : 20,
      cursor || undefined,
      Object.keys(filters).length > 0 ? filters : undefined,
    );
  }

  @Get('errors/stats')
  async getErrorStats(
    @Query('minStatus') minStatus?: string,
    @Query('maxStatus') maxStatus?: string,
    @Query('search') search?: string,
  ) {
    const filters = {
      ...(minStatus !== undefined ? { minStatus: parseInt(minStatus, 10) } : {}),
      ...(maxStatus !== undefined ? { maxStatus: parseInt(maxStatus, 10) } : {}),
      ...(search ? { search } : {}),
    };
    return this.apiErrorDb.getStats(
      Object.keys(filters).length > 0 ? filters : undefined,
    );
  }

  @Post('errors/seed')
  async seedErrors() {
    const created = await Promise.all(MONITORING_SEED_ERRORS.map((e) => this.apiErrorDb.create(e)));
    created.forEach((e) => {
      this.errorStore.push({
        timestamp: e.createdAt.toISOString(),
        method: e.method,
        url: e.url,
        statusCode: e.statusCode,
        message: e.message,
        stack: e.stack,
      });
    });
    return { seeded: created.length };
  }

  @Delete('errors')
  async clearErrors() {
    await this.apiErrorDb.clear();
    this.errorStore.clear();
    return { cleared: true };
  }
}
