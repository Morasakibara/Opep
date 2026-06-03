import { Controller, Get, Post, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TicketsService } from '../services/tickets.service';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('generate/:passengerId')
  async generate(@Param('passengerId') passengerId: string) {
    return this.ticketsService.generateForPassenger(passengerId);
  }

  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.ticketsService.generatePdf(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ticket-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }
}
