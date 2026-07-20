import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TicketsService } from './services/tickets.service';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard, SubscriptionGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('generate/:reservationId')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async generateTickets(@Param('reservationId') reservationId: string) {
    const tickets = await this.ticketsService.generateTicketsForReservation(reservationId);
    return tickets.map(TicketResponseDto.fromEntity);
  }

  @Get('my')
  async getMyTickets(@GetUser('id') userId: string) {
    const tickets = await this.ticketsService.getMyTickets(userId);
    return tickets.map(TicketResponseDto.fromEntity);
  }

  @Get('reservation/:reservationId')
  async getByReservation(@Param('reservationId') reservationId: string) {
    const tickets = await this.ticketsService.getTicketsByReservation(reservationId);
    return tickets.map(TicketResponseDto.fromEntity);
  }

  @Post('validate')
  @Throttle({ short: { limit: 60, ttl: 60000 } })
  async validateTicket(@Body() body: { qrString: string }, @GetUser('id') userId: string) {
    const result = await this.ticketsService.validateAndScan(body.qrString, userId);
    return result;
  }

  @Get(':id')
  async getTicket(@Param('id') id: string) {
    const ticket = await this.ticketsService.getTicket(id);
    return TicketResponseDto.fromEntity(ticket);
  }
}
