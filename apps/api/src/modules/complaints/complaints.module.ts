import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { ComplaintsService } from './services/complaints.service';
import { ComplaintsController } from './complaints.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint, Subscription])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}
