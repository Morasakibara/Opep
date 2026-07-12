import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { User } from '../../users/entities/user.entity';

@Entity('centres')
export class Centre extends BaseEntity {
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid', nullable: true })
  managerUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'managerUserId' })
  manager: User;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  // Local policy overrides (nullable = use platform defaults)
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  cancellationPenaltyPercent: number;

  @Column({ nullable: true })
  maxFreeReports: number;

  @Column({ nullable: true })
  minDepositPercent: number;

  // Public rating
  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  publicRatingAverage: number;

  @Column({ default: 0 })
  reviewsCount: number;
}
