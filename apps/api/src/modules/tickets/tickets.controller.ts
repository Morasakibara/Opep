import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { TicketsService } from './services/tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('generate/:reservationId')
  async generateTickets(@Param('reservationId') reservationId: string) {
    return this.ticketsService.generateTicketsForReservation(reservationId);
  }

  @Get('reservation/:reservationId')
  async getByReservation(@Param('reservationId') reservationId: string) {
    return this.ticketsService.getTicketsByReservation(reservationId);
  }

  @Get(':id')
  async getTicket(@Param('id') id: string) {
    return this.ticketsService.getTicket(id);
  }
}
