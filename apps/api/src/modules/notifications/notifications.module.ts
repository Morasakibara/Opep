import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { NotificationEntity } from './entities/notification.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import { NotificationsController } from './notifications.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, Reservation]),
    BullModule.registerQueue({
      name: 'notifications-queue',
    }),
    AuditModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationService, NotificationProcessor],
  exports: [NotificationService],
})
export class NotificationsModule {}
