import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
