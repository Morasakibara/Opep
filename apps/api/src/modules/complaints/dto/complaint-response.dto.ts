import { Complaint, ComplaintCategory, ComplaintStatus } from '../entities/complaint.entity';

export class ComplaintResponseDto {
  id: string;
  tripId?: string;
  reservationId?: string;
  clientId: string;
  centreId: string;
  companyId: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  response?: string;
  resolvedAt?: Date;
  createdAt: Date;

  static fromEntity(complaint: Complaint): ComplaintResponseDto {
    return {
      id: complaint.id,
      tripId: complaint.tripId,
      reservationId: complaint.reservationId,
      clientId: complaint.clientId,
      centreId: complaint.centreId,
      companyId: complaint.companyId,
      category: complaint.category,
      description: complaint.description,
      status: complaint.status,
      response: complaint.response,
      resolvedAt: complaint.resolvedAt,
      createdAt: complaint.createdAt,
    };
  }
}
