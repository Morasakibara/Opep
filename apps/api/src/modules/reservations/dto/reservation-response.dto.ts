import { PassengerResponseDto } from '../../reservations/dto/passenger-response.dto';

export class ReservationResponseDto {
  id: string;
  reservationCode: string;
  tripId: string;
  clientId: string;
  agencyId: string;
  type: string;
  totalAmount: number;
  status: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
  createdByRole: string;
  refundEligibleAmount?: number;
  refundPolicy?: string;
  trip?: { id: string; departureDateTime: string; basePrice: number; status: string; route?: { departureCity: string; arrivalCity: string } };
  passengers?: PassengerResponseDto[];
  createdAt: string;
  updatedAt: string;

  static fromEntity(reservation: any): ReservationResponseDto {
    return {
      id: reservation.id,
      reservationCode: reservation.reservationCode,
      tripId: reservation.tripId,
      clientId: reservation.clientId,
      agencyId: reservation.agencyId,
      type: reservation.type,
      totalAmount: reservation.totalAmount,
      status: reservation.status,
      cancelledAt: reservation.cancelledAt?.toISOString?.() ?? reservation.cancelledAt,
      cancelledBy: reservation.cancelledBy,
      cancelReason: reservation.cancelReason,
      createdByRole: reservation.createdByRole,
      refundEligibleAmount: reservation.refundEligibleAmount,
      refundPolicy: reservation.refundPolicy,
      trip: reservation.trip ? {
        id: reservation.trip.id,
        departureDateTime: reservation.trip.departureDateTime?.toISOString?.() ?? reservation.trip.departureDateTime,
        basePrice: reservation.trip.basePrice,
        status: reservation.trip.status,
        route: reservation.trip.route ? {
          departureCity: reservation.trip.route.departureCity,
          arrivalCity: reservation.trip.route.arrivalCity,
        } : undefined,
      } : undefined,
      passengers: reservation.passengers?.map(PassengerResponseDto.fromEntity),
      createdAt: reservation.createdAt?.toISOString?.() ?? reservation.createdAt,
      updatedAt: reservation.updatedAt?.toISOString?.() ?? reservation.updatedAt,
    };
  }
}
