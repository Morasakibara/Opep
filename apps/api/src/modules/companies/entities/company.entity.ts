import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  directorUserId: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'directorUserId' })
  director: User;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  publicRatingAverage: number;

  @Column({ default: 0 })
  reviewsCount: number;
}
