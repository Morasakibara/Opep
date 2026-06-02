import { IsString, IsNotEmpty, IsNumber, Min, IsObject } from 'class-validator';

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @Min(1)
  totalSeats: number;

  @IsObject()
  seatLayout: {
    rows: number;
    cols: number;
    aisleIndices: number[];
    unavailableSeats: string[];
  };
}
