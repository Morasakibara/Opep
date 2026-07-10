import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Agency } from '../agencies/entities/agency.entity';

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

  @ManyToOne(() => Agency)
  agency: Agency;


}