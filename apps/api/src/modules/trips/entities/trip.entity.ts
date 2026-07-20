import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Route } from '../../routes/entities/route.entity';
import { Bus } from '../../buses/entities/bus.entity';
import { Centre } from '../../centres/entities/centre.entity';

export enum TripStatus {
  SCHEDULED = 'SCHEDULED',
  BOARDING = 'BOARDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('trips')
export class Trip extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  agencyId: string;

  @Column({ type: 'uuid', nullable: true })
  centreId: string;

  @ManyToOne(() => Centre, { nullable: true })
  @JoinColumn({ name: 'centreId' })
  centre: Centre;

  @Column({ type: 'uuid' })
  routeId: string;

  @ManyToOne(() => Route)
  @JoinColumn({ name: 'routeId' })
  route: Route;

  @Column({ type: 'uuid' })
  busId: string;

  @ManyToOne(() => Bus)
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @Column({ type: 'uuid', nullable: true })
  driverId: string;

  @Column({ type: 'timestamp' })
  departureDateTime: Date;

  @Column({ type: 'timestamp' })
  arrivalDateTime: Date;

  @Column('integer')
  basePrice: number; // En XAF

  @Column({ default: 'XAF' })
  currencyCode: string;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.SCHEDULED,
  })
  status: TripStatus;

  @Column({ type: 'jsonb', nullable: true })
  pricingRules: any;
}
