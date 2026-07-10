import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { ReservationsService } from '../services/reservations.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { ReservationResponseDto } from '../dto/reservation-response.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { PaginationDto, paginate } from '../../../common/dto/pagination.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.CONTROLLER)
  async findAll(@GetUser() user: any, @Query() paginationDto: PaginationDto) {
    const agencyId = user.agencyId;
    if (!agencyId) {
      return paginate([], 0, paginationDto);
    }
    const { items, total } = await this.reservationsService.findByAgency(agencyId, paginationDto);
    return paginate(items.map(ReservationResponseDto.fromEntity), total, paginationDto);
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
  async findMyReservations(@GetUser('id') clientId: string, @Query() paginationDto: PaginationDto) {
    const { items, total } = await this.reservationsService.findByClient(clientId, paginationDto);
    return paginate(items.map(ReservationResponseDto.fromEntity), total, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const reservation = await this.reservationsService.findOne(id);
    return ReservationResponseDto.fromEntity(reservation);
  }
}
