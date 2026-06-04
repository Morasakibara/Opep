import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentProvider } from '../entities/payment.entity';

export class ProcessPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  reservationId: string;

  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  provider: PaymentProvider;

  @IsString()
  @IsOptional()
  phoneNumber?: string; // For Mobile Money

  @IsString()
  @IsOptional()
  stripeToken?: string; // For Stripe

  @IsString()
  @IsOptional()
  paymentMethod?: string; // e.g., 'mobile_money', 'card', 'cash'
}
