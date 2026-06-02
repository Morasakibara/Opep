import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Language } from '@opep/shared-types';

export enum LegalDocumentType {
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
}

@Entity('legal_documents')
export class LegalDocument extends BaseEntity {
  @Column({
    type: 'enum',
    enum: LegalDocumentType,
  })
  type: LegalDocumentType;

  @Column()
  version: string;

  @Column({
    type: 'enum',
    enum: Language,
  })
  lang: Language;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp' })
  publishedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
