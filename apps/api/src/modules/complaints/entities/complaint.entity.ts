import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum ComplaintCategory {
  COMPORTEMENT_CHAUFFEUR = 'COMPORTEMENT_CHAUFFEUR',
  RETARD = 'RETARD',
  PROPRETE_CONFORT = 'PROPRETE_CONFORT',
  SECURITE = 'SECURITE',
  BAGAGE = 'BAGAGE',
  SERVICE_GUICHET = 'SERVICE_GUICHET',
  AUTRE = 'AUTRE',
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

@Entity('complaints')
export class Complaint extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  tripId: string;

  @Column({ type: 'uuid', nullable: true })
  reservationId: string;

  @Column({ type: 'uuid' })
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({ type: 'uuid' })
  centreId: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({
    type: 'enum',
    enum: ComplaintCategory,
  })
  category: ComplaintCategory;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.OPEN,
  })
  status: ComplaintStatus;

  @Column({ type: 'uuid', nullable: true })
  assignedToUserId: string;

  @Column('text', { nullable: true })
  response: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  resolvedBy: string;
}
