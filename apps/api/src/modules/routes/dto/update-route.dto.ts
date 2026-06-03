import { PartialType } from '@nestjs/mapped-types';
import { CreateRouteDto } from './create-route.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRouteDto extends PartialType(CreateRouteDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
