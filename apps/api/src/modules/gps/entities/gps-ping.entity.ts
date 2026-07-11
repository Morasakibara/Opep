import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Trip } from '../../trips/entities/trip.entity';

@Entity('gps_pings')
@Index(['tripId', 'recordedAt'])
export class GpsPing extends BaseEntity {
  @Column({ type: 'uuid' })
  tripId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('float', { nullable: true })
  speed: number;

  @Column('float', { nullable: true })
  heading: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  recordedAt: Date;
}
