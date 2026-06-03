import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PassengerDto {
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
  tripId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];
}
