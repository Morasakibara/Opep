import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AgencyOwnershipGuard } from '../../auth/guards/agency-ownership.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { BusesService } from '../services/buses.service';
import { CreateBusDto } from '../dto/create-bus.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';

@Controller('buses')
@UseGuards(JwtAuthGuard, RolesGuard, AgencyOwnershipGuard)
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async create(@Body() createBusDto: CreateBusDto, @GetUser('agencyId') agencyId: string) {
    return this.busesService.create(agencyId, createBusDto);
  }

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findAll(@GetUser('agencyId') agencyId: string) {
    return this.busesService.findAll(agencyId);
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findOne(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    return this.busesService.findOne(agencyId, id);
  }
}
