import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from '../entities/bus.entity';
import { BusesService } from '../services/buses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bus])],
  providers: [BusesService],
  exports: [BusesService],
})
export class BusesModule {}
