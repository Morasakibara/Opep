import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ErrorStoreService } from '../../common/filters/error-store.service';
import { ApiError } from './entities/api-error.entity';
import { ApiErrorDbService } from './services/api-error-db.service';
import { MonitoringController } from './monitoring.controller';
import { ErrorGateway } from './error.gateway';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ApiError]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN', '1h') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MonitoringController],
  providers: [ErrorStoreService, ApiErrorDbService, ErrorGateway],
  exports: [ErrorStoreService, ApiErrorDbService, ErrorGateway],
})
export class MonitoringModule {}
