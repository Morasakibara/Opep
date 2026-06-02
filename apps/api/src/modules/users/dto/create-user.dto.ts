import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { UserRole, Language, NotificationChannel } from '@opep/shared-types';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsUUID()
  @IsOptional()
  agencyId?: string;

  @IsEnum(Language)
  @IsOptional()
  preferredLanguage?: Language;

  @IsEnum(NotificationChannel)
  @IsOptional()
  notificationChannel?: NotificationChannel;
}
