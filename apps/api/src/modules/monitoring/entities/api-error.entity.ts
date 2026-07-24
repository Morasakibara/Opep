import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('api_errors')
@Index(['statusCode', 'createdAt'])
@Index(['createdAt'])
export class ApiError extends BaseEntity {
  @Column()
  method: string;

  @Column()
  url: string;

  @Column()
  statusCode: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  stack: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;
}
