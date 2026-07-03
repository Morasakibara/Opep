import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM, UserRole.DRIVER)
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Get(':id/performance')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM, UserRole.DRIVER)
  getPerformance(@Param('id') id: string) {
    return this.driversService.getPerformance(id);
  }

  @Post(':id/rating')
  @Roles(UserRole.CLIENT, UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  rate(@Param('id') id: string, @Body() body: { rating: number }) {
    return this.driversService.updateRating(id, body.rating);
  }
}