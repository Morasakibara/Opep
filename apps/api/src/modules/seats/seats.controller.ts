import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SeatsService } from './services/seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { SeatResponseDto } from './dto/seat-response.dto';
import { LockSeatsDto, UnlockSeatsDto } from './dto/lock-seats.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';

@Controller('seats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async create(@Body() dto: CreateSeatDto) {
    const seat = await this.seatsService.create(dto);
    return SeatResponseDto.fromEntity(seat);
  }

  @Post('bulk/:tripId')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  async bulkCreate(
    @Param('tripId') tripId: string,
    @Body('totalSeats') totalSeats: number,
    @Body('cols') cols: number,
  ) {
    const seats = await this.seatsService.bulkCreate(tripId, totalSeats, cols);
    return seats.map(SeatResponseDto.fromEntity);
  }

  @Get('trip/:tripId')
  async findByTrip(@Param('tripId') tripId: string) {
    const seats = await this.seatsService.findByTrip(tripId);
    return seats.map(SeatResponseDto.fromEntity);
  }

  @Get('trip/:tripId/available')
  async findAvailable(@Param('tripId') tripId: string) {
    const seats = await this.seatsService.findAvailableByTrip(tripId);
    return seats.map(SeatResponseDto.fromEntity);
  }

  @Post('lock')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.CASHIER)
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async lock(@Body() dto: LockSeatsDto) {
    const seats = await this.seatsService.lockSeats(dto);
    return seats.map(SeatResponseDto.fromEntity);
  }

  @Post('unlock')
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER, UserRole.CASHIER)
  async unlock(@Body() dto: UnlockSeatsDto) {
    await this.seatsService.unlockSeats(dto);
    return { message: 'Sièges déverrouillés avec succès' };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_PLATFORM)
  async remove(@Param('id') id: string) {
    await this.seatsService.remove(id);
    return { message: 'Siège supprimé avec succès' };
  }
}
