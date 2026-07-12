import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Seat } from './entities/seat.entity';
import { Trip } from '../trips/entities/trip.entity';
import { SeatsService } from './services/seats.service';
import { SeatsController } from './seats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seat, Trip]),
  ],
  controllers: [SeatsController],
  providers: [SeatsService],
  exports: [SeatsService],
})
export class SeatsModule {}
