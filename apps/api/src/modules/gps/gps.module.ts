import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { GpsGateway } from './gps.gateway';
import { GpsController } from './gps.controller';
import { GpsPing } from './entities/gps-ping.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { GpsProcessor } from './gps.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([GpsPing, Subscription]),
    BullModule.registerQueue({
      name: 'gps-queue',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN', '1h') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GpsController],
  providers: [GpsGateway, GpsProcessor],
  exports: [GpsGateway],
})
export class GpsModule {}
