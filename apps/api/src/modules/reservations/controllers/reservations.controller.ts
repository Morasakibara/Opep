import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { ReservationsService } from '../services/reservations.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { ReservationResponseDto } from '../dto/reservation-response.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.CONTROLLER)
  async findAll(@GetUser() user: any) {
    const agencyId = user.agencyId;
    if (!agencyId) {
      return [];
    }
    const reservations = await this.reservationsService.findByAgency(agencyId);
    return reservations.map(ReservationResponseDto.fromEntity);
  }

  @Post()
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser('id') clientId: string,
    @GetUser('role') role: string,
  ) {
    const reservation = await this.reservationsService.create(clientId, role, createReservationDto);
    return ReservationResponseDto.fromEntity(reservation);
  }

  @Get('my')
  async findMyReservations(@GetUser('id') clientId: string) {
    const reservations = await this.reservationsService.findByClient(clientId);
    return reservations.map(ReservationResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const reservation = await this.reservationsService.findOne(id);
    return ReservationResponseDto.fromEntity(reservation);
  }
}
