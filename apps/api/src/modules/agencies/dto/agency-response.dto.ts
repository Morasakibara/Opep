export class AgencyResponseDto {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logoUrl?: string;
  isActive: boolean;
  subscriptionPlan: string;
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt: string;

  static fromEntity(agency: any): AgencyResponseDto {
    return {
      id: agency.id,
      name: agency.name,
      address: agency.address,
      city: agency.city,
      phone: agency.phone,
      email: agency.email,
      logoUrl: agency.logoUrl,
      isActive: agency.isActive,
      subscriptionPlan: agency.subscriptionPlan,
      subscriptionExpiresAt: agency.subscriptionExpiresAt?.toISOString?.() ?? agency.subscriptionExpiresAt,
      createdAt: agency.createdAt?.toISOString?.() ?? agency.createdAt,
      updatedAt: agency.updatedAt?.toISOString?.() ?? agency.updatedAt,
    };
  }
}
