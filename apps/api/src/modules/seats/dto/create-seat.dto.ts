import { IsString, IsUUID, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateSeatDto {
  @IsUUID()
  tripId: string;

  @IsString()
  seatNumber: string;

  @IsOptional()
  @IsBoolean()
  isWindow?: boolean;

  @IsOptional()
  @IsBoolean()
  isAisle?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  rowNumber?: number;

  @IsOptional()
  @IsString()
  colLetter?: string;
}
