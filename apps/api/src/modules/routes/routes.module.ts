import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../entities/route.entity';
import { RoutesService } from '../services/routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
