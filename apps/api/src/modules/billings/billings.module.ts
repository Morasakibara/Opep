import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Company } from '../companies/entities/company.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { BillingsService } from './services/billings.service';
import { BillingsController } from './billings.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Company, Subscription]),
    AuditModule,
  ],
  controllers: [BillingsController],
  providers: [BillingsService],
  exports: [BillingsService],
})
export class BillingsModule {}
