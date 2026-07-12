import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Centre } from './entities/centre.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { CentresService } from './services/centres.service';
import { CentresController } from './centres.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Centre, Subscription])],
  controllers: [CentresController],
  providers: [CentresService],
  exports: [CentresService],
})
export class CentresModule {}
