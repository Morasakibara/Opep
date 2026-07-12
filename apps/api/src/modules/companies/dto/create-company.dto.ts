import { IsString, IsOptional, IsEmail, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsUUID()
  directorUserId?: string;
}
