import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sessions')
@Index(['userId', 'isRevoked'])
@Index(['expiresAt'])
export class Session extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ unique: true })
  tokenHash: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column('text', { nullable: true })
  userAgent: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date;
}
