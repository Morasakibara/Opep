import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  role: string;
  isActive: boolean;
  agencyId?: string;
  preferredLanguage: string;
  notificationChannel: string;
  notificationPhone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;

  static fromEntity(user: any): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      agencyId: user.agencyId,
      preferredLanguage: user.preferredLanguage,
      notificationChannel: user.notificationChannel,
      notificationPhone: user.notificationPhone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt?.toISOString?.() ?? user.createdAt,
      updatedAt: user.updatedAt?.toISOString?.() ?? user.updatedAt,
    };
  }
}
