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
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';
import { PerUserThrottlerGuard } from './common/guards/per-user-throttler.guard';
import { CsrfOriginGuard } from './common/guards/csrf-origin.guard';
import { RedisModule, REDIS_CLIENT } from './common/redis/redis.module';
import { getRedisConnectionOptions } from './common/redis/redis.config';
import { ReportsModule } from './modules/reports/reports.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
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
import { GpsModule } from './modules/gps/gps.module';
import { ReviewModule } from './modules/reviews/review.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CentresModule } from './modules/centres/centres.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { BillingsModule } from './modules/billings/billings.module';
import { SeatsModule } from './modules/seats/seats.module';
import { OfflineScanModule } from './modules/offline-scan/offline-scan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(process.cwd(), '.env.local'),
        path.join(process.cwd(), '.env'),
        path.join(process.cwd(), '../../.env.local'),
        path.join(process.cwd(), '../../.env'),
      ],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    I18nModule.forRoot({
      fallbackLanguage: 'fr',
      loaderOptions: {
        path: path.join(process.cwd(), 'i18n'),
        watch: true,
      },
      resolvers: [
        { use: AcceptLanguageResolver, options: { matchType: 'strict-loose' } },
      ],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: getRedisConnectionOptions(configService),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    IncidentsModule,
    DriversModule,
    SubscriptionsModule,
    MessagesModule,
    MetricsModule,
    PasswordModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule, RedisModule],
      useFactory: (config: ConfigService, redisClient: Redis) => ({
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
        storage: new ThrottlerStorageRedisService(redisClient),
      }),
      inject: [ConfigService, REDIS_CLIENT],
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
    GpsModule,
    ReviewModule,
    CompaniesModule,
    CentresModule,
    ComplaintsModule,
    BillingsModule,
    SeatsModule,
    OfflineScanModule,
    SchedulesModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CsrfOriginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PerUserThrottlerGuard,
    },
  ],
})
export class AppModule {}
