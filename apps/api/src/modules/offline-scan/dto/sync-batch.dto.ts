import { IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOfflineScanDto } from './create-offline-scan.dto';

export class SyncBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOfflineScanDto)
  scans: CreateOfflineScanDto[];

  @IsOptional()
  @IsString()
  deviceId?: string;
}
