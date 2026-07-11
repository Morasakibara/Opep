import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { SchedulesService } from '../services/schedules.service';

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async findAll() {
    return this.schedulesService.findAll();
  }

  @Get('cities')
  @Throttle({ public: { limit: 30, ttl: 60000 } })
  async getCityDepartures() {
    return this.schedulesService.getCityDepartures();
  }

  @Get('route/:routeId')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async findByRouteId(@Param('routeId') routeId: string) {
    return this.schedulesService.findByRouteId(routeId);
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async create(@Body() data: any) {
    return this.schedulesService.create(data);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_PLATFORM)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.schedulesService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_PLATFORM)
  async remove(@Param('id') id: string) {
    await this.schedulesService.remove(id);
    return { message: 'Horaire supprimé avec succès' };
  }
}
