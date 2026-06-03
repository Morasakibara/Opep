import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';
import { ReservationsService } from '../services/reservations.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.CASHIER, UserRole.AGENCY_MANAGER)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser('id') clientId: string,
    @GetUser('role') role: string,
  ) {
    return this.reservationsService.create(clientId, role, createReservationDto);
  }

  @Get('my')
  @Roles(UserRole.CLIENT)
  async findAll(@GetUser('id') clientId: string) {
    return this.reservationsService.findAllByClient(clientId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser('id') clientId: string) {
    return this.reservationsService.findOne(id, clientId);
  }
}
