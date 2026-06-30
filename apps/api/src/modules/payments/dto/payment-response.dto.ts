export class PaymentResponseDto {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  provider: string;
  providerTransactionId?: string;
  providerReference?: string;
  status: string;
  paymentMethod: string;
  failureReason?: string;
  refundedAt?: string;
  refundedBy?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;

  static fromEntity(payment: any): PaymentResponseDto {
    return {
      id: payment.id,
      reservationId: payment.reservationId,
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      providerTransactionId: payment.providerTransactionId,
      providerReference: payment.providerReference,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      failureReason: payment.failureReason,
      refundedAt: payment.refundedAt?.toISOString?.() ?? payment.refundedAt,
      refundedBy: payment.refundedBy,
      refundAmount: payment.refundAmount,
      createdAt: payment.createdAt?.toISOString?.() ?? payment.createdAt,
      updatedAt: payment.updatedAt?.toISOString?.() ?? payment.updatedAt,
    };
  }
}
