import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../users/entities/user.entity';
import { Trip } from '../trips/entities/trip.entity';
import { Agency } from '../agencies/entities/agency.entity';
import { Centre } from '../centres/entities/centre.entity';

@Entity('reviews')
@Unique(['tripId', 'clientId'])
export class Review extends BaseEntity {
  @Column({ type: 'uuid' })
  tripId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column({ type: 'uuid' })
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({ type: 'uuid' })
  agencyId: string;

  @ManyToOne(() => Agency)
  @JoinColumn({ name: 'agencyId' })
  agency: Agency;

  @Column({ type: 'uuid', nullable: true })
  centreId: string;

  @ManyToOne(() => Centre, { nullable: true })
  @JoinColumn({ name: 'centreId' })
  centre: Centre;

  @Column({ type: 'int' })
  driverRating: number; // 1-5

  @Column({ type: 'int' })
  comfortRating: number; // 1-5

  @Column('text', { nullable: true })
  comment: string;

  @Column({ default: true })
  isPublic: boolean;
}
