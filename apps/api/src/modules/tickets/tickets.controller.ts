import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TicketsService } from './services/tickets.service';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('generate/:reservationId')
  async generateTickets(@Param('reservationId') reservationId: string) {
    const tickets = await this.ticketsService.generateTicketsForReservation(reservationId);
    return tickets.map(TicketResponseDto.fromEntity);
  }

  @Get('reservation/:reservationId')
  async getByReservation(@Param('reservationId') reservationId: string) {
    const tickets = await this.ticketsService.getTicketsByReservation(reservationId);
    return tickets.map(TicketResponseDto.fromEntity);
  }

  @Post('validate')
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
