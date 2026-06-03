import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Passenger } from '../reservations/entities/passenger.entity';
import { TicketsService } from './services/tickets.service';
import { TicketsController } from './controllers/tickets.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Passenger]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
