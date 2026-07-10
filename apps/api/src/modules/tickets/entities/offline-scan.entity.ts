import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Ticket } from './ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('offline_scans')
export class OfflineScan extends BaseEntity {
  @Column({ type: 'uuid' })
  ticketId: string;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  @Column({ type: 'uuid' })
  scannedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'scannedBy' })
  controller: User;

  @Column({ type: 'timestamp' })
  scannedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ default: false })
  syncedToServer: boolean;

  @Column({ type: 'timestamp', nullable: true })
  syncedAt: Date;

  @Column({ nullable: true })
  deviceId: string;
}
