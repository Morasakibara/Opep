import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('packages')
  @Roles(UserRole.COMPANY_DIRECTOR, UserRole.ADMIN_PLATFORM)
  getPackages() {
    return this.subscriptionsService.getPackages();
  }

  @Post('subscribe')
  @Roles(UserRole.COMPANY_DIRECTOR, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  subscribe(@Body() body: { companyId: string; planId: string }) {
    return this.subscriptionsService.subscribe(body.companyId, body.planId);
  }

  @Get('status')
  @Roles(UserRole.COMPANY_DIRECTOR, UserRole.ADMIN_PLATFORM)
  getStatus(@Query('companyId') companyId: string) {
    return this.subscriptionsService.getStatus(companyId);
  }
}