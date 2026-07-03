import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;
}