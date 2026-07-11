import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, Min, Max } from 'class-validator';
import { PaymentProvider } from '../entities/payment.entity';

export class DepositPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  reservationId: string;

  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  provider: PaymentProvider;

  @IsInt()
  @Min(30)
  @Max(100)
  @IsOptional()
  depositPercentage?: number = 30;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  stripeToken?: string;
}
