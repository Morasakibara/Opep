export class RouteResponseDto {
  id: string;
  agencyId: string;
  departureCity: string;
  arrivalCity: string;
  distanceKm: number;
  estimatedDurationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  static fromEntity(route: any): RouteResponseDto {
    return {
      id: route.id,
      agencyId: route.agencyId,
      departureCity: route.departureCity,
      arrivalCity: route.arrivalCity,
      distanceKm: route.distanceKm,
      estimatedDurationMinutes: route.estimatedDurationMinutes,
      isActive: route.isActive,
      createdAt: route.createdAt?.toISOString?.() ?? route.createdAt,
      updatedAt: route.updatedAt?.toISOString?.() ?? route.updatedAt,
    };
  }
}
