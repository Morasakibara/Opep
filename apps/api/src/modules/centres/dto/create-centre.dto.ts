import { IsString, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateCentreDto {
  @IsUUID()
  companyId: string;

  @IsOptional()
  @IsUUID()
  managerUserId?: string;

  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cancellationPenaltyPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxFreeReports?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minDepositPercent?: number;
}
