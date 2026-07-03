import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TicketsService } from './services/tickets.service';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('generate/:reservationId')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async generateTickets(@Param('reservationId') reservationId: string) {
    const tickets = await this.ticketsService.generateTicketsForReservation(reservationId);
    return tickets.map(TicketResponseDto.fromEntity);
  }

  @Get('my')
  async getMyTickets(@Req() req: any) {
    const tickets = await this.ticketsService.getMyTickets(req.user.id);
    return tickets.map(TicketResponseDto.fromEntity);
  }

  @Get('reservation/:reservationId')
  async getByReservation(@Param('reservationId') reservationId: string) {
    const tickets = await this.ticketsService.getTicketsByReservation(reservationId);
    return tickets.map(TicketResponseDto.fromEntity);
  }

  @Post('validate')
  @Throttle({ short: { limit: 60, ttl: 60000 } })
  async validateTicket(@Body() body: { qrString: string }, @Req() req: any) {
    const result = await this.ticketsService.validateAndScan(body.qrString, req.user?.id);
    return result;
  }

  @Get(':id')
  async getTicket(@Param('id') id: string) {
    const ticket = await this.ticketsService.getTicket(id);
    return TicketResponseDto.fromEntity(ticket);
  }
}
