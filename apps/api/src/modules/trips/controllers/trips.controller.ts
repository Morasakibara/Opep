import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AgencyOwnershipGuard } from '../../auth/guards/agency-ownership.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { TripsService } from '../services/trips.service';
import { CreateTripDto } from '../dto/create-trip.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, AgencyOwnershipGuard)
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  async create(@Body() createTripDto: CreateTripDto, @GetUser('agencyId') agencyId: string) {
    return this.tripsService.create(agencyId, createTripDto);
  }

  @Get('search')
  async search(
    @Query('departureCity') departureCity: string,
    @Query('arrivalCity') arrivalCity: string,
    @Query('date') date: string,
    @Query('passengers') passengers: number,
  ) {
    return this.tripsService.search({
      departureCity,
      arrivalCity,
      date,
      passengers: +passengers,
    });
  }
}
