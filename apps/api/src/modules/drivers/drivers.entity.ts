import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../users/entities/user.entity';

@Entity('drivers')
export class Driver extends BaseEntity {

  @Column({ unique: true })
  licenseNumber: string;

  @Column({ default: 'ACTIVE' })
  status: string; // ACTIVE, SUSPENDED, ON_LEAVE

  @Column('float', { default: 5.0 })
  rating: number;

  @Column('int', { default: 0 })
  totalTrips: number;

  @Column({ nullable: true })
  performanceScore: number; // 0 to 100

  @OneToOne(() => User)
  @JoinColumn()
  user: User;


}