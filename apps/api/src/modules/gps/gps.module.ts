import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GpsGateway } from './gps.gateway';
import { GpsController } from './gps.controller';
import { GpsPing } from './entities/gps-ping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GpsPing]),
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
  providers: [GpsGateway],
  exports: [GpsGateway],
})
export class GpsModule {}
