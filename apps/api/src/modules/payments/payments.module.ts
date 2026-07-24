import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './services/payments.service';
import { PaymentsMockProcessor } from './test/payments-mock.processor';
import { PaymentsController } from './payments.controller';
import { PaymentsWebhookController } from './payments-webhook.controller';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { ConfigModule } from '@nestjs/config';
import { TicketsModule } from '../tickets/tickets.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Reservation, Subscription]),
    BullModule.registerQueue({
      name: 'payments-queue',
    }),
    ConfigModule,
    TicketsModule,
    AuditModule,
    NotificationsModule,
  ],
  providers: [PaymentsService, PaymentsMockProcessor],
  controllers: [PaymentsController, PaymentsWebhookController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
