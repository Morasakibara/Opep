import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Passenger } from './entities/passenger.entity';
import { Trip } from '../trips/entities/trip.entity';
import { ReservationsService } from './services/reservations.service';
import { ReservationsController } from './controllers/reservations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Passenger, Trip]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
