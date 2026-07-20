import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { items, total } = await this.driversService.findAll(paginationDto);
    return paginate(items, total, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM, UserRole.DRIVER)
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Get(':id/performance')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM, UserRole.DRIVER)
  getPerformance(@Param('id') id: string) {
    return this.driversService.getPerformance(id);
  }

  @Post(':id/rating')
  @Roles(UserRole.CLIENT, UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  rate(@Param('id') id: string, @Body() body: { rating: number }) {
    return this.driversService.updateRating(id, body.rating);
  }
}