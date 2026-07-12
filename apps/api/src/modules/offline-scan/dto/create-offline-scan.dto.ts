import { IsString, IsUUID, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateOfflineScanDto {
  @IsUUID()
  ticketId: string;

  @IsString()
  qrPayload: string;

  @IsString()
  qrSignature: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  deviceName?: string;
}
