import { IsUUID, IsDateString, IsNumber, Min, IsEnum } from 'class-validator';
import { TripStatus } from '../entities/trip.entity';

export class CreateTripDto {
  @IsUUID()
  routeId: string;

  @IsUUID()
  busId: string;

  @IsDateString()
  departureDateTime: string;

  @IsDateString()
  arrivalDateTime: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsEnum(TripStatus)
  status?: TripStatus;
}
