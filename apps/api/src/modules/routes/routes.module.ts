import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { RoutesService } from './services/routes.service';
import { RoutesController } from './controllers/routes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Subscription])],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
