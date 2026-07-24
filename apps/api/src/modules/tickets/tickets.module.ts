import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { OfflineScan } from './entities/offline-scan.entity';
import { TicketsService } from './services/tickets.service';
import { TicketsController } from './tickets.controller';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Passenger } from '../reservations/entities/passenger.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, OfflineScan, Reservation, Passenger, Subscription]),
    ConfigModule,
  ],
  providers: [TicketsService],
  controllers: [TicketsController],
  exports: [TicketsService],
})
export class TicketsModule {}
