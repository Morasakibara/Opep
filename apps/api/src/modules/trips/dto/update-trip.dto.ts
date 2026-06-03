import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { TripStatus } from '../entities/trip.entity';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;
}
