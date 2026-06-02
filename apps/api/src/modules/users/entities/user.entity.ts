import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole, Language, NotificationChannel } from '@opep/shared-types';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'uuid', nullable: true })
  agencyId: string;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.FR,
  })
  preferredLanguage: Language;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.WHATSAPP,
  })
  notificationChannel: NotificationChannel;

  @Column({ nullable: true })
  notificationPhone: string;

  @Column({ type: 'timestamp', nullable: true })
  privacyPolicyAcceptedAt: Date;

  @Column({ nullable: true })
  privacyPolicyVersion: string;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt: Date;

  @Column({ nullable: true })
  termsVersion: string;

  @Column({ nullable: true })
  privacyPolicyAcceptedLang: string;
}
