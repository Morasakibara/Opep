import { IncidentsModule } from './modules/incidents/incidents.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { MessagesModule } from './modules/messages/messages.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { PerUserThrottlerGuard } from './common/guards/per-user-throttler.guard';
import { CsrfOriginGuard } from './common/guards/csrf-origin.guard';
import { MetricsModule } from './modules/metrics/metrics.module';
import { PasswordModule } from './common/password/password.module';
import { dataSourceOptions } from './config/typeorm.config';
import { AppController } from './app.controller';
import { BusesModule } from './modules/buses/buses.module';
import { RoutesModule } from './modules/routes/routes.module';
import { TripsModule } from './modules/trips/trips.module';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    IncidentsModule,
    DriversModule,
    SubscriptionsModule,
    MessagesModule,
    MetricsModule,
    PasswordModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'long',
            ttl: parseInt(config.get('THROTTLE_LONG_TTL', '60000'), 10),
            limit: parseInt(config.get('THROTTLE_LONG_LIMIT', '50'), 10),
          },
          {
            name: 'medium',
            ttl: parseInt(config.get('THROTTLE_MEDIUM_TTL', '60000'), 10),
            limit: parseInt(config.get('THROTTLE_MEDIUM_LIMIT', '30'), 10),
          },
          {
            name: 'short',
            ttl: parseInt(config.get('THROTTLE_SHORT_TTL', '1000'), 10),
            limit: parseInt(config.get('THROTTLE_SHORT_LIMIT', '3'), 10),
          },
          {
            name: 'public',
            ttl: parseInt(config.get('THROTTLE_PUBLIC_TTL', '60000'), 10),
            limit: parseInt(config.get('THROTTLE_PUBLIC_LIMIT', '30'), 10),
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: config.get('REDIS_HOST', 'localhost'),
            port: parseInt(config.get('REDIS_PORT', '6379'), 10),
          }),
        ),
      }),
      inject: [ConfigService],
    }),
    AuditModule,
    AgenciesModule,
    UsersModule,
    AuthModule,
    BusesModule,
    RoutesModule,
    TripsModule,
    ReservationsModule,
    PaymentsModule,
    TicketsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      // CSRF is checked FIRST (cheap header/cookie inspection, no Redis
      // round-trip). This protects Redis from DoS amplification where an
      // attacker floods the API with cross-origin POSTs. Visibility into
      // such attempts is preserved by the `csrf_rejections_total` counter.
      provide: APP_GUARD,
      useClass: CsrfOriginGuard,
    },
    {
      // Throttler runs SECOND — only after the request proves it isn't a
      // cross-origin forgery. Each tier check increments a Redis-backed
      // storage key (cheap via ThrottlerStorageRedisService).
      provide: APP_GUARD,
      useClass: PerUserThrottlerGuard,
    },
  ],
})
export class AppModule {}
