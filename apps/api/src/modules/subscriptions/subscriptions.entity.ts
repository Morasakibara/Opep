import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../companies/entities/company.entity';

@Entity('subscriptions')
export class Subscription extends BaseEntity {

  @Column()
  planName: string; // STARTER, PREMIUM, ENTERPRISE

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  status: string; // ACTIVE, EXPIRED, CANCELLED

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;
}