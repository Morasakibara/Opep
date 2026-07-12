import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Agency } from '../../agencies/entities/agency.entity';
import { Centre } from '../../centres/entities/centre.entity';

@Entity('buses')
export class Bus extends BaseEntity {
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

  @Column({ unique: true })
  plateNumber: string;

  @Column()
  model: string;

  @Column()
  totalSeats: number;

  @Column({ type: 'jsonb' })
  seatLayout: any; // { rows: number, cols: number, unavailableSeats: string[] }

  @Column({ default: true })
  isActive: boolean;
}
