import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Agency } from '../agencies/entities/agency.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;
}