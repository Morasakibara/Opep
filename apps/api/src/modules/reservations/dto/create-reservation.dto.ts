import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationType } from '../entities/reservation.entity';

class PassengerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  idCardNumber?: string;

  @IsString()
  @IsNotEmpty()
  seatNumber: string;
}

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsEnum(ReservationType)
  type: ReservationType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];
}
