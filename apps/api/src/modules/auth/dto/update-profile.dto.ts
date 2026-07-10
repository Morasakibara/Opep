import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Language, NotificationChannel } from '@opep/shared-types';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

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
}
