import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './services/tickets.service';
import { TicketsController } from './tickets.controller';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Passenger } from '../reservations/entities/passenger.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Reservation, Passenger]),
    ConfigModule,
  ],
  providers: [TicketsService],
  controllers: [TicketsController],
  exports: [TicketsService],
})
export class TicketsModule {}
