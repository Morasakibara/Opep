import { Controller, Get, Delete, Query } from '@nestjs/common';
import { ErrorStoreService } from '../../common/filters/error-store.service';
import { ApiErrorDbService } from './services/api-error-db.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly errorStore: ErrorStoreService,
    private readonly apiErrorDb: ApiErrorDbService,
  ) {}

  @Get('errors')
  async getRecentErrors(@Query('limit') limit?: string, @Query('cursor') cursor?: string) {
    return this.apiErrorDb.findRecent(
      limit ? parseInt(limit, 10) : 20,
      cursor || undefined,
    );
  }

  @Get('errors/stats')
  async getErrorStats() {
    return this.apiErrorDb.getStats();
  }

  @Delete('errors')
  async clearErrors() {
    await this.apiErrorDb.clear();
    this.errorStore.clear();
    return { cleared: true };
  }
}
