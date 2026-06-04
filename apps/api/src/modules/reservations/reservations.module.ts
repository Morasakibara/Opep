import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Reservation } from './entities/reservation.entity';
import { Passenger } from './entities/passenger.entity';
import { Trip } from '../trips/entities/trip.entity';
import { ReservationsService } from './services/reservations.service';
import { ReservationsController } from './controllers/reservations.controller';
import { ReservationsProcessor } from './services/reservations.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Passenger, Trip]),
    BullModule.registerQueue({
      name: 'reservations-queue',
    }),
  ],
  providers: [ReservationsService, ReservationsProcessor],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
