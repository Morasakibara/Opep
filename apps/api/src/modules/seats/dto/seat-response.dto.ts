import { Seat, SeatStatus } from '../entities/seat.entity';

export class SeatResponseDto {
  id: string;
  tripId: string;
  seatNumber: string;
  status: SeatStatus;
  isWindow: boolean;
  isAisle: boolean;
  rowNumber: number;
  colLetter: string;
  reservationId?: string;
  passengerId?: string;
  lockedBy?: string;

  static fromEntity(seat: Seat): SeatResponseDto {
    return {
      id: seat.id,
      tripId: seat.tripId,
      seatNumber: seat.seatNumber,
      status: seat.status,
      isWindow: seat.isWindow,
      isAisle: seat.isAisle,
      rowNumber: seat.rowNumber,
      colLetter: seat.colLetter,
      reservationId: seat.reservationId,
      passengerId: seat.passengerId,
      lockedBy: seat.lockedBy,
    };
  }
}
