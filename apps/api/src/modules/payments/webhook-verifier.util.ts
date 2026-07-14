import * as crypto from 'crypto';

/**
 * Attempts to verify a Stripe webhook signature using HMAC-SHA256.
 * Stripe requires the raw request body for proper signature verification.
 *
 * Returns true if the signature is valid, false if verification fails or
 * if the webhook secret is not configured (development mode).
 */
export function verifyStripeSignature(
  rawBody: Buffer | string | undefined | null,
  signatureHeader: string | undefined,
  webhookSecret: string | undefined,
): boolean {
  if (!webhookSecret) {
    // Secret not configured — skip verification (dev mode)
    return true;
  }

  if (!signatureHeader || !rawBody) {
    return false;
  }

  try {
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Stripe sends signatures in format: t=timestamp,v1=signature[,v1=signature,...]
    const sigValue = signatureHeader.includes(',')
      ? signatureHeader
          .split(',')
          .find((s) => s.startsWith('v1='))
          ?.split('=')[1]
      : signatureHeader;

    if (!sigValue || sigValue.length < 10) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(sigValue);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}
