import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfflineScan } from './entities/offline-scan.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { OfflineScanService } from './services/offline-scan.service';
import { OfflineScanController } from './offline-scan.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfflineScan, Ticket]),
    AuditModule,
  ],
  controllers: [OfflineScanController],
  providers: [OfflineScanService],
  exports: [OfflineScanService],
})
export class OfflineScanModule {}
