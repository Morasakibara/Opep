import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { NotificationEntity } from './entities/notification.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import { NotificationsController } from './notifications.controller';
import { AuditModule } from '../audit/audit.module';
import { AfricasTalkingService } from './africastalking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, Reservation]),
    BullModule.registerQueue({
      name: 'notifications-queue',
    }),
    AuditModule,
    ConfigModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationService, NotificationProcessor, AfricasTalkingService],
  exports: [NotificationService, AfricasTalkingService],
})
export class NotificationsModule {}
