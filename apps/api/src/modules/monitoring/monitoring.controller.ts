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

  @Delete('errors')
  async clearErrors() {
    await this.apiErrorDb.clear();
    this.errorStore.clear();
    return { cleared: true };
  }
}
