export class TripResponseDto {
  id: string;
  agencyId: string;
  routeId: string;
  busId: string;
  driverId?: string;
  departureDateTime: string;
  arrivalDateTime: string;
  basePrice: number;
  currencyCode: string;
  status: string;
  pricingRules?: any;
  route?: { id: string; departureCity: string; arrivalCity: string };
  bus?: { id: string; plateNumber: string; model: string; totalSeats: number };
  createdAt: string;
  updatedAt: string;

  static fromEntity(trip: any): TripResponseDto {
    return {
      id: trip.id,
      agencyId: trip.agencyId,
      routeId: trip.routeId,
      busId: trip.busId,
      driverId: trip.driverId,
      departureDateTime: trip.departureDateTime?.toISOString?.() ?? trip.departureDateTime,
      arrivalDateTime: trip.arrivalDateTime?.toISOString?.() ?? trip.arrivalDateTime,
      basePrice: trip.basePrice,
      currencyCode: trip.currencyCode,
      status: trip.status,
      pricingRules: trip.pricingRules,
      route: trip.route ? {
        id: trip.route.id,
        departureCity: trip.route.departureCity,
        arrivalCity: trip.route.arrivalCity,
      } : undefined,
      bus: trip.bus ? {
        id: trip.bus.id,
        plateNumber: trip.bus.plateNumber,
        model: trip.bus.model,
        totalSeats: trip.bus.totalSeats,
      } : undefined,
      createdAt: trip.createdAt?.toISOString?.() ?? trip.createdAt,
      updatedAt: trip.updatedAt?.toISOString?.() ?? trip.updatedAt,
    };
  }
}
