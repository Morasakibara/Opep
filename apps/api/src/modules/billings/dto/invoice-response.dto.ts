import { Invoice } from '../entities/invoice.entity';
import { InvoiceStatus } from '@opep/shared-types';

export class InvoiceResponseDto {
  id: string;
  companyId: string;
  subscriptionId: string;
  periodStart: Date;
  periodEnd: Date;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: Date;
  paidAt?: Date;

  static fromEntity(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      companyId: invoice.companyId,
      subscriptionId: invoice.subscriptionId,
      periodStart: invoice.periodStart,
      periodEnd: invoice.periodEnd,
      amount: Number(invoice.amount),
      currency: invoice.currency,
      status: invoice.status,
      issuedAt: invoice.issuedAt,
      paidAt: invoice.paidAt,
    };
  }
}
