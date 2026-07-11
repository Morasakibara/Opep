import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum NotificationType {
  DEPARTURE_1H = 'DEPARTURE_1H',
  DEPARTURE_30MIN = 'DEPARTURE_30MIN',
  DEPARTURE_15MIN = 'DEPARTURE_15MIN',
  DEPARTURE_5MIN = 'DEPARTURE_5MIN',
  TRIP_MODIFIED = 'TRIP_MODIFIED',
  BUS_CHANGED = 'BUS_CHANGED',
  DRIVER_CHANGED = 'DRIVER_CHANGED',
}

export enum NotificationChannel {
  PUSH = 'PUSH',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

@Entity('notifications')
@Index(['userId', 'status'])
@Index(['scheduledAt'])
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  reservationId: string;

  @Column({ type: 'uuid', nullable: true })
  tripId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.PUSH,
  })
  channel: NotificationChannel;

  @Column('text')
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column('text', { nullable: true })
  errorMessage: string;
}
