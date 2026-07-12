import { IsArray, IsUUID, IsString } from 'class-validator';

export class LockSeatsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  seatIds: string[];

  @IsString()
  lockedBy: string;
}

export class UnlockSeatsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  seatIds: string[];
}
