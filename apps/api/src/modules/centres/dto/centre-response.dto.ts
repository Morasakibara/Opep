import { Centre } from '../entities/centre.entity';

export class CentreResponseDto {
  id: string;
  companyId: string;
  companyName?: string;
  managerUserId?: string;
  managerName?: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  cancellationPenaltyPercent?: number;
  maxFreeReports?: number;
  minDepositPercent?: number;
  publicRatingAverage?: number;
  reviewsCount: number;
  createdAt: Date;

  static fromEntity(centre: Centre): CentreResponseDto {
    return {
      id: centre.id,
      companyId: centre.companyId,
      companyName: centre.company?.name,
      managerUserId: centre.managerUserId,
      managerName: centre.manager
        ? `${centre.manager.firstName} ${centre.manager.lastName}`
        : undefined,
      name: centre.name,
      city: centre.city,
      address: centre.address,
      phone: centre.phone,
      email: centre.email,
      isActive: centre.isActive,
      cancellationPenaltyPercent: centre.cancellationPenaltyPercent
        ? Number(centre.cancellationPenaltyPercent)
        : undefined,
      maxFreeReports: centre.maxFreeReports,
      minDepositPercent: centre.minDepositPercent,
      publicRatingAverage: centre.publicRatingAverage
        ? Number(centre.publicRatingAverage)
        : undefined,
      reviewsCount: centre.reviewsCount,
      createdAt: centre.createdAt,
    };
  }
}
