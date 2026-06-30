export class PassengerResponseDto {
  id: string;
  reservationId: string;
  firstName: string;
  lastName: string;
  idCardNumber?: string;
  seatNumber: string;
  ticketId?: string;
  createdAt: string;

  static fromEntity(passenger: any): PassengerResponseDto {
    return {
      id: passenger.id,
      reservationId: passenger.reservationId,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      idCardNumber: passenger.idCardNumber,
      seatNumber: passenger.seatNumber,
      ticketId: passenger.ticketId,
      createdAt: passenger.createdAt?.toISOString?.() ?? passenger.createdAt,
    };
  }
}
