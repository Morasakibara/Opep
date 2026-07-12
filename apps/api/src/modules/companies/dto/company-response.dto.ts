import { Company } from '../entities/company.entity';

export class CompanyResponseDto {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logoUrl?: string;
  isActive: boolean;
  directorUserId?: string;
  directorName?: string;
  publicRatingAverage?: number;
  reviewsCount: number;
  createdAt: Date;

  static fromEntity(company: Company): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      address: company.address,
      city: company.city,
      phone: company.phone,
      email: company.email,
      logoUrl: company.logoUrl,
      isActive: company.isActive,
      directorUserId: company.directorUserId,
      directorName: company.director
        ? `${company.director.firstName} ${company.director.lastName}`
        : undefined,
      publicRatingAverage: company.publicRatingAverage
        ? Number(company.publicRatingAverage)
        : undefined,
      reviewsCount: company.reviewsCount,
      createdAt: company.createdAt,
    };
  }
}
