import { Controller, Get, Delete, Query } from '@nestjs/common';
import { ErrorStoreService } from '../../common/filters/error-store.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly errorStore: ErrorStoreService) {}

  @Get('errors')
  getRecentErrors(@Query('limit') limit?: string) {
    return this.errorStore.getRecent(limit ? parseInt(limit, 10) : 20);
  }

  @Get('errors/stats')
  getErrorStats() {
    return this.errorStore.getStats();
  }

  @Delete('errors')
  clearErrors() {
    this.errorStore.clear();
    return { cleared: true };
  }
}
