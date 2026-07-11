import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Route } from '../../routes/entities/route.entity';

@Entity('schedules')
export class Schedule extends BaseEntity {
  @Column({ type: 'uuid' })
  routeId: string;

  @ManyToOne(() => Route, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routeId' })
  route?: Route;

  @Column({ type: 'varchar', length: 5 })
  departureTime: string; // Format: 'HH:MM'

  @Column({ type: 'varchar', length: 100 })
  company: string;

  @Column({ default: true })
  isActive: boolean;
}
