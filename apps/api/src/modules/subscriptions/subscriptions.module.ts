import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Subscription } from './subscriptions.entity';
import { Company } from '../companies/entities/company.entity';
import { Invoice } from '../billings/entities/invoice.entity';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsProcessor } from './subscriptions.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Company, Invoice]),
    BullModule.registerQueue({
      name: 'subscriptions-queue',
    }),
  ],
  providers: [SubscriptionsService, SubscriptionsProcessor],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}