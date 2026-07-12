import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

export enum OfflineScanStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  INVALID = 'INVALID',
  CONFLICT = 'CONFLICT',
}

@Entity('offline_scans')
@Index(['deviceId', 'syncedAt'])
@Index(['ticketId'])
export class OfflineScan extends BaseEntity {
  @Column({ type: 'uuid' })
  ticketId: string;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  @Column('text')
  qrPayload: string;

  @Column('text')
  qrSignature: string;

  @Column({
    type: 'enum',
    enum: OfflineScanStatus,
    default: OfflineScanStatus.PENDING_VERIFICATION,
  })
  status: OfflineScanStatus;

  @Column({ type: 'timestamp' })
  scannedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  scannedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;

  @Column({ nullable: true })
  deviceId: string;

  @Column({ nullable: true })
  deviceName: string;

  @Column({ type: 'timestamp', nullable: true })
  syncedAt: Date;

  @Column({ nullable: true })
  failureReason: string;
}
