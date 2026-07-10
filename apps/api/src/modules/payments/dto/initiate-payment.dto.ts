import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentProvider } from '../entities/payment.entity';

export class InitiatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  reservationId: string;

  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  provider: PaymentProvider;

  @IsString()
  @IsOptional()
  phoneNumber?: string; // For Mobile Money (MTN/Orange)

  @IsString()
  @IsOptional()
  stripeToken?: string; // For Stripe
}
