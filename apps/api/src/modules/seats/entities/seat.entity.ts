import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  OCCUPIED = 'OCCUPIED',
  UNAVAILABLE = 'UNAVAILABLE',
}

@Entity('seats')
@Index(['tripId', 'seatNumber'], { unique: true })
@Index(['tripId', 'status'])
export class Seat extends BaseEntity {
  @Column({ type: 'uuid' })
  tripId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  seatNumber: string;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.AVAILABLE,
  })
  status: SeatStatus;

  @Column({ type: 'uuid', nullable: true })
  reservationId: string;

  @ManyToOne(() => Reservation, { nullable: true })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @Column({ type: 'uuid', nullable: true })
  passengerId: string;

  @Column({ type: 'varchar', nullable: true })
  lockedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  lockedAt: Date;

  @Column({ default: false })
  isWindow: boolean;

  @Column({ default: false })
  isAisle: boolean;

  @Column({ default: 1 })
  rowNumber: number;

  @Column({ default: 'A' })
  colLetter: string;
}
