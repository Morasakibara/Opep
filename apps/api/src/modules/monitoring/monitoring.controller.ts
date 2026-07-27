import { Controller, Get, Post, Delete, Query } from '@nestjs/common';
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

  @Post('errors/seed')
  async seedErrors() {
    const errors = [
      { method: 'GET', url: '/api/v1/companies', statusCode: 500, message: 'Cannot read properties of undefined' },
      { method: 'POST', url: '/api/v1/reservations', statusCode: 400, message: 'Validation failed: seatId must be a string' },
      { method: 'GET', url: '/api/v1/users/me', statusCode: 401, message: 'Invalid or expired token' },
      { method: 'GET', url: '/api/v1/trips/search?from=Douala&to=Yaounde', statusCode: 404, message: 'Route not found: Douala → Yaounde' },
      { method: 'PUT', url: '/api/v1/buses/LT-001-AA', statusCode: 500, message: 'Database connection timeout' },
      { method: 'DELETE', url: '/api/v1/tickets/INVALID', statusCode: 400, message: 'Invalid ticket format' },
      { method: 'POST', url: '/api/v1/payments/initiate', statusCode: 502, message: 'Upstream provider timeout: MTN Mobile Money' },
      { method: 'PATCH', url: '/api/v1/trips/abc123/status', statusCode: 403, message: 'Insufficient permissions: only managers can update trip status' },
      { method: 'GET', url: '/api/v1/reports/revenue?period=invalid', statusCode: 422, message: 'Invalid period format. Use: daily, weekly, monthly' },
      { method: 'POST', url: '/api/v1/auth/login', statusCode: 429, message: 'Too many login attempts. Try again in 60 seconds' },
    ];
    const created = await Promise.all(errors.map((e) => this.apiErrorDb.create(e)));
    this.errorStore.add(created.map((e) => ({
      id: e.id,
      createdAt: e.createdAt.toISOString(),
      method: e.method,
      url: e.url,
      statusCode: e.statusCode,
      message: e.message,
      stack: e.stack,
    })));
    return { seeded: created.length };
  }

  @Delete('errors')
  async clearErrors() {
    await this.apiErrorDb.clear();
    this.errorStore.clear();
    return { cleared: true };
  }
}
