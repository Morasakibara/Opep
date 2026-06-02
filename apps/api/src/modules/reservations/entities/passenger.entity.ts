import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('passengers')
export class Passenger extends BaseEntity {
  @Column({ type: 'uuid' })
  reservationId: string;

  @ManyToOne(() => Reservation)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  idCardNumber: string;

  @Column()
  seatNumber: string;

  @Column({ type: 'uuid', nullable: true })
  ticketId: string;
}
