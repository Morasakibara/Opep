import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ComplaintCategory } from '../entities/complaint.entity';

export class CreateComplaintDto {
  @IsOptional()
  @IsUUID()
  tripId?: string;

  @IsOptional()
  @IsUUID()
  reservationId?: string;

  @IsUUID()
  centreId: string;

  @IsUUID()
  companyId: string;

  @IsEnum(ComplaintCategory)
  category: ComplaintCategory;

  @IsString()
  description: string;
}
