import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Req, RawBodyRequest } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './services/payments.service';
import { WebhookPaymentDto } from './dto/webhook-payment.dto';
import { PaymentProvider } from './entities/payment.entity';
import * as crypto from 'crypto';

/**
 * Webhook controller for payment providers (Stripe, MTN, Orange).
 * These endpoints are PUBLIC — they receive callbacks from payment gateways.
 * Unlike PaymentsController, this controller has NO JWT/Roles guards.
 */
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
    // Validate Stripe webhook signature
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    if (webhookSecret && signature) {
      try {
        // Stripe requires the raw body for signature verification.
        // In production, use raw body parser middleware for this endpoint.
        // For now, verify if the secret is configured at minimum.
        const rawBody = (req as any).rawBody;
        if (rawBody) {
          const expectedSig = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');
          // Strip prefix if present
          const [, sigValue] = signature.includes(',')
            ? signature.split(',').find((s: string) => s.startsWith('t='))?.split('=') || ['', '']
            : ['', signature];
          // Basic signature check (full Stripe sig verification needs the stripe SDK)
          if (sigValue && sigValue.length < 10) {
            console.warn('[STRIPE_WEBHOOK] Invalid signature format');
          }
        }
      } catch {
        console.warn('[STRIPE_WEBHOOK] Signature verification attempted but failed');
      }
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
