import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../users/entities/user.entity';
import { Trip } from '../trips/entities/trip.entity';

@Entity('incidents')
export class Incident extends BaseEntity {

  @Column()
  type: string; // ACCIDENT, DELAY, MECHANICAL_BREAKDOWN, OTHER

  @Column('text')
  description: string;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, INVESTIGATING, RESOLVED, REJECTED

  @Column({ default: false })
  refundTriggered: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundAmount: number;

  @ManyToOne(() => User, { nullable: true })
  reportedBy: User;

  @ManyToOne(() => Trip, { nullable: true })
  trip: Trip;


}