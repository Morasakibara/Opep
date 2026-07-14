import { IsString, IsEmail, IsEnum, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { UserRole, Language, NotificationChannel } from '@opep/shared-types';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsOptional()
  agencyId?: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsUUID()
  @IsOptional()
  centreId?: string;

  @IsEnum(Language)
  @IsOptional()
  preferredLanguage?: Language;

  @IsEnum(NotificationChannel)
  @IsOptional()
  notificationChannel?: NotificationChannel;

  @IsString()
  @IsOptional()
  notificationPhone?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  fcmToken?: string;
}
