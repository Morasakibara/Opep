import { PartialType } from '@nestjs/mapped-types';
import { CreateBusDto } from './create-bus.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBusDto extends PartialType(CreateBusDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
