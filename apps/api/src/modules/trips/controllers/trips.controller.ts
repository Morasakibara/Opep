import { Controller, Get, Post, Body, Query, UseGuards, Param, Patch, Delete, BadRequestException } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { OwnershipGuard } from '../../../common/guards/ownership.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { TripsService } from '../services/trips.service';
import { CreateTripDto } from '../dto/create-trip.dto';
import { TripResponseDto } from '../dto/trip-response.dto';
import { TripStatus } from '../entities/trip.entity';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { PaginationDto, paginate } from '../../../common/dto/pagination.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async create(@Body() createTripDto: CreateTripDto, @GetUser('agencyId') agencyId: string, @GetUser('centreId') centreId: string) {
    const trip = await this.tripsService.create(agencyId, centreId, createTripDto);
    return TripResponseDto.fromEntity(trip);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM)
  async findAll(
    @GetUser('agencyId') agencyId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const { items, total } = await this.tripsService.findAll(agencyId, paginationDto);
    return paginate(items.map(TripResponseDto.fromEntity), total, paginationDto);
  }

  @Get('available')
  @SkipThrottle({ long: true, medium: true, short: true })
  @Throttle({ public: { limit: 30, ttl: 60000 } })
  async findAvailable(@Query() paginationDto: PaginationDto) {
    const { items, total } = await this.tripsService.findAvailable(paginationDto);
    return paginate(items.map(TripResponseDto.fromEntity), total, paginationDto);
  }

  @Get('search')
  @SkipThrottle({ long: true, medium: true, short: true })
  @Throttle({ public: { limit: 30, ttl: 60000 } })
  async search(
    @Query('departureCity') departureCity: string,
    @Query('arrivalCity') arrivalCity: string,
    @Query('date') date: string,
    @Query('passengers') passengers: number,
    @Query() paginationDto: PaginationDto,
  ) {
    const { items, total } = await this.tripsService.search({
      departureCity,
      arrivalCity,
      date,
      passengers: +passengers,
    }, paginationDto);
    return paginate(items.map(TripResponseDto.fromEntity), total, paginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @Roles(UserRole.AGENCY_MANAGER, UserRole.CASHIER, UserRole.ADMIN_PLATFORM, UserRole.CLIENT)
  async findOne(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    const trip = await this.tripsService.findOne(agencyId, id);
    return TripResponseDto.fromEntity(trip);
  }

  @Get(':id/seats')
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  async getSeats(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    return this.tripsService.getSeats(agencyId, id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @GetUser('agencyId') agencyId: string,
  ) {
    if (!Object.values(TripStatus).includes(status as TripStatus)) {
      throw new BadRequestException(`Statut invalide. Valeurs acceptées: ${Object.values(TripStatus).join(', ')}`);
    }
    const trip = await this.tripsService.updateStatus(agencyId, id, status as TripStatus);
    return TripResponseDto.fromEntity(trip);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async update(
    @Param('id') id: string, 
    @Body() updateTripDto: any, 
    @GetUser('agencyId') agencyId: string
  ) {
    const trip = await this.tripsService.update(agencyId, id, updateTripDto);
    return TripResponseDto.fromEntity(trip);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @Roles(UserRole.AGENCY_MANAGER, UserRole.ADMIN_PLATFORM)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async remove(@Param('id') id: string, @GetUser('agencyId') agencyId: string) {
    await this.tripsService.remove(agencyId, id);
    return { message: 'Voyage supprimé avec succès' };
  }
}
