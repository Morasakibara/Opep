import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Controller('incidents')
@UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.CONTROLLER, UserRole.DRIVER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { items, total } = await this.incidentsService.findAll(paginationDto);
    return paginate(items, total, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM, UserRole.CLIENT)
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id/resolve')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CENTRE_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  resolve(@Param('id') id: string, @Body() body: { refundAmount?: number }) {
    return this.incidentsService.resolve(id, body.refundAmount);
  }
}