import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AgencyOwnershipGuard } from '../../auth/guards/agency-ownership.guard';
import { SubscriptionGuard } from '../../auth/guards/subscription.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { BusesService } from '../services/buses.service';
import { CreateBusDto } from '../dto/create-bus.dto';
import { BusResponseDto } from '../dto/bus-response.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';

@Controller('buses')
@UseGuards(JwtAuthGuard, RolesGuard, AgencyOwnershipGuard, SubscriptionGuard)
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async create(@Body() createBusDto: CreateBusDto, @GetUser('agencyId') agencyId: string) {
    const bus = await this.busesService.create(agencyId, createBusDto);
    return BusResponseDto.fromEntity(bus);
  }

  @Get()
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findAll(@GetUser('agencyId') agencyId: string) {
    const buses = await this.busesService.findAll(agencyId);
    return buses.map(BusResponseDto.fromEntity);
  }

  @Get(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findOne(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    const bus = await this.busesService.findOne(agencyId, id);
    return BusResponseDto.fromEntity(bus);
  }

  @Patch(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async update(
    @Param('id') id: string, 
    @Body() updateBusDto: any, 
    @GetUser('agencyId') agencyId: string
  ) {
    const bus = await this.busesService.update(agencyId, id, updateBusDto);
    return BusResponseDto.fromEntity(bus);
  }

  @Delete(':id')
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async remove(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    await this.busesService.remove(agencyId, id);
    return { message: 'Bus supprimé avec succès' };
  }
}
