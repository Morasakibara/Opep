import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { AgenciesService } from './services/agencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agency])],
  providers: [AgenciesService],
  exports: [AgenciesService],
})
export class AgenciesModule {}
