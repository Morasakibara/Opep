import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Subscription } from '../../subscriptions/subscriptions.entity';
import { InvoiceStatus } from '@opep/shared-types';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid' })
  subscriptionId: string;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column({ type: 'timestamp' })
  periodStart: Date;

  @Column({ type: 'timestamp' })
  periodEnd: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'XAF' })
  currency: string;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.UNPAID,
  })
  status: InvoiceStatus;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  issuedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;
}
