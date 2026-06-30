export class TicketResponseDto {
  id: string;
  passengerId: string;
  reservationId: string;
  qrPayload: string;
  issuedAt: string;
  validUntil: string;
  status: string;
  scannedAt?: string;
  scannedBy?: string;
  scannedOffline: boolean;
  passenger?: { id: string; firstName: string; lastName: string; seatNumber: string };
  createdAt: string;

  static fromEntity(ticket: any): TicketResponseDto {
    return {
      id: ticket.id,
      passengerId: ticket.passengerId,
      reservationId: ticket.reservationId,
      qrPayload: ticket.qrPayload,
      issuedAt: ticket.issuedAt?.toISOString?.() ?? ticket.issuedAt,
      validUntil: ticket.validUntil?.toISOString?.() ?? ticket.validUntil,
      status: ticket.status,
      scannedAt: ticket.scannedAt?.toISOString?.() ?? ticket.scannedAt,
      scannedBy: ticket.scannedBy,
      scannedOffline: ticket.scannedOffline,
      passenger: ticket.passenger ? {
        id: ticket.passenger.id,
        firstName: ticket.passenger.firstName,
        lastName: ticket.passenger.lastName,
        seatNumber: ticket.passenger.seatNumber,
      } : undefined,
      createdAt: ticket.createdAt?.toISOString?.() ?? ticket.createdAt,
    };
  }
}
