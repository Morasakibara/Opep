export class BusResponseDto {
  id: string;
  agencyId: string;
  plateNumber: string;
  model: string;
  totalSeats: number;
  seatLayout: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  static fromEntity(bus: any): BusResponseDto {
    return {
      id: bus.id,
      agencyId: bus.agencyId,
      plateNumber: bus.plateNumber,
      model: bus.model,
      totalSeats: bus.totalSeats,
      seatLayout: bus.seatLayout,
      isActive: bus.isActive,
      createdAt: bus.createdAt?.toISOString?.() ?? bus.createdAt,
      updatedAt: bus.updatedAt?.toISOString?.() ?? bus.updatedAt,
    };
  }
}
