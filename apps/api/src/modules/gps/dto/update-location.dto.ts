import { IsNumber, IsOptional, IsLatitude, IsLongitude, Min } from 'class-validator';

export class UpdateLocationDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  speed?: number;

  @IsOptional()
  @IsNumber()
  heading?: number;
}
