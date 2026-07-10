import {
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { PaymentProvider } from '../entities/payment.entity';

export class WebhookPaymentDto {
  @IsNotEmpty()
  transactionId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsNotEmpty()
  status: 'SUCCESS' | 'FAILED' | 'PENDING';

  @IsUUID()
  @IsOptional()
  reservationId?: string;

  @IsOptional()
  reference?: string;

  @IsOptional()
  metadata?: any;
}

export class RefundPaymentDto {
  @IsUUID()
  @IsOptional()
  refundedBy?: string;

  @IsOptional()
  reason?: string;

  @IsOptional()
  amount?: number; // Partial refund amount; if omitted, full refund
}
