import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  departureCity: string;

  @IsString()
  @IsNotEmpty()
  arrivalCity: string;

  @IsNumber()
  @Min(1)
  distanceKm: number;

  @IsNumber()
  @Min(1)
  estimatedDurationMinutes: number;
}
