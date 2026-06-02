import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Passenger } from '../../reservations/entities/passenger.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum TicketStatus {
  VALID = 'VALID',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

@Entity('tickets')
export class Ticket extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  passengerId: string;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passengerId' })
  passenger: Passenger;

  @Column({ type: 'uuid' })
  reservationId: string;

  @ManyToOne(() => Reservation)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @Column('text')
  qrPayload: string;

  @Column('text')
  qrSignature: string;

  @Column({ type: 'timestamp' })
  issuedAt: Date;

  @Column({ type: 'timestamp' })
  validUntil: Date;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.VALID,
  })
  status: TicketStatus;

  @Column({ type: 'timestamp', nullable: true })
  scannedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  scannedBy: string;

  @Column({ default: false })
  scannedOffline: boolean;

  @Column({ type: 'timestamp', nullable: true })
  syncedAt: Date;
}
