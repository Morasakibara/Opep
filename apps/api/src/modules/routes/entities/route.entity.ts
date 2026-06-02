import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Agency } from '../../agencies/entities/agency.entity';

@Entity('routes')
export class Route extends BaseEntity {
  @Column({ type: 'uuid' })
  agencyId: string;

  @ManyToOne(() => Agency)
  @JoinColumn({ name: 'agencyId' })
  agency: Agency;

  @Column()
  departureCity: string;

  @Column()
  arrivalCity: string;

  @Column('float')
  distanceKm: number;

  @Column()
  estimatedDurationMinutes: number;

  @Column({ default: true })
  isActive: boolean;
}
