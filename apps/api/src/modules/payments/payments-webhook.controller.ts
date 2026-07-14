import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Req, RawBodyRequest } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './services/payments.service';
import { WebhookPaymentDto } from './dto/webhook-payment.dto';
import { PaymentProvider } from './entities/payment.entity';
import { verifyStripeSignature } from './webhook-verifier.util';

@Controller('payments')
export class PaymentsWebhookController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('webhook/stripe')
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    const rawBody = (req as any).rawBody;

    if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
      return { received: false, reason: 'Invalid signature' };
    }

    if (!payload?.data?.object?.id && !payload?.id) {
      return { received: false, reason: 'Missing transaction ID' };
    }

    return this.paymentsService.handleWebhook(PaymentProvider.STRIPE, {
      transactionId: payload.data?.object?.id ?? payload.id,
      provider: PaymentProvider.STRIPE,
      status: payload.type === 'payment_intent.succeeded' ? 'SUCCESS' : 'FAILED',
      metadata: payload,
      reference: payload.data?.object?.metadata?.reservationId,
    });
  }

  @Post('webhook/mtn')
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async mtnWebhook(@Body() webhookDto: WebhookPaymentDto) {
    return this.paymentsService.handleWebhook(PaymentProvider.MTN_MOMO, webhookDto);
  }

  @Post('webhook/orange')
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async orangeWebhook(@Body() webhookDto: WebhookPaymentDto) {
    return this.paymentsService.handleWebhook(PaymentProvider.ORANGE_MONEY, webhookDto);
  }
}
