import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { BusesService } from './services/buses.service';
import { BusesController } from './controllers/buses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bus])],
  controllers: [BusesController],
  providers: [BusesService],
  exports: [BusesService],
})
export class BusesModule {}
