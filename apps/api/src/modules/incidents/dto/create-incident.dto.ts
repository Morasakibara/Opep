import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';

export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  DELAY = 'DELAY',
  MECHANICAL_BREAKDOWN = 'MECHANICAL_BREAKDOWN',
  OTHER = 'OTHER',
}

export class CreateIncidentDto {
  @IsEnum(IncidentType)
  @IsNotEmpty()
  type: IncidentType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsOptional()
  reportedById?: string;

  @IsUUID()
  @IsOptional()
  tripId?: string;
}
