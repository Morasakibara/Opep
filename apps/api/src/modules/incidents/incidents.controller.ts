import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';

@Controller('incidents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.CONTROLLER, UserRole.DRIVER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  create(@Body() body: any) {
    return this.incidentsService.create(body);
  }

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  findAll() {
    return this.incidentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM, UserRole.CLIENT)
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id/resolve')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  resolve(@Param('id') id: string, @Body() body: { refundAmount?: number }) {
    return this.incidentsService.resolve(id, body.refundAmount);
  }
}