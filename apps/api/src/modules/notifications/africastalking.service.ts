import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Africa's Talking SDK wrapper for sending SMS and WhatsApp messages.
 *
 * In production, initialise the AT SDK with credentials from environment
 * variables (AT_API_KEY, AT_USERNAME).  In development/sandbox mode the
 * service falls back to logging (no network call).
 *
 * Environment variables:
 *   AT_API_KEY   – Africa's Talking API key
 *   AT_USERNAME  – Africa's Talking username ('sandbox' for dev)
 *   AT_ACTIVE    – set to 'true' to hit the real AT API
 */
@Injectable()
export class AfricasTalkingService {
  private readonly logger = new Logger(AfricasTalkingService.name);
  private readonly active: boolean;
  private readonly username: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.active = configService.get<string>('AT_ACTIVE') === 'true';
    this.username = configService.get<string>('AT_USERNAME', 'sandbox');
    this.apiKey = configService.get<string>('AT_API_KEY', '');

    if (this.active && !this.apiKey) {
      this.logger.warn(
        'AT_ACTIVE=true but AT_API_KEY is not set – SMS/WhatsApp will fall back to mock mode',
      );
    }
  }

  /**
   * Send an SMS via Africa's Talking.
   * Falls back to console.log when the SDK is not loaded (dev mode) or when
   * the AT_ACTIVE flag is not set.
   */
  async sendSms(
    to: string,
    message: string,
    senderId?: string,
  ): Promise<{ success: boolean; response?: any; error?: string }> {
    if (!this.active) {
      this.logger.log(`[AT Mock SMS] To: ${to} | Message: ${message}`);
      return { success: true };
    }

    try {
      // Dynamic import – the package may not resolve under certain bundlers;
      // we catch and fall back gracefully.
      const AT = await this.loadSdk();
      const sms = AT.SMS;

      const options: any = {
        to: [to],
        message,
      };
      if (senderId) options.senderId = senderId;

      const response = await sms.send(options);
      this.logger.log(`[AT SMS] Sent to ${to} – ${response?.SMSMessageData?.Message}`);
      return { success: true, response };
    } catch (err: any) {
      this.logger.error(`[AT SMS] Failed for ${to}: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Send a WhatsApp message via Africa's Talking.
   * Falls back to console.log in dev mode.
   */
  async sendWhatsApp(
    to: string,
    message: string,
    waNumber?: string,
  ): Promise<{ success: boolean; response?: any; error?: string }> {
    if (!this.active) {
      this.logger.log(`[AT Mock WhatsApp] To: ${to} | Message: ${message}`);
      return { success: true };
    }

    try {
      const AT = await this.loadSdk();
      const whatsapp = AT.WHATSAPP;

      const options: any = {
        phoneNumber: to,
        body: { message },
      };
      if (waNumber) options.waNumber = waNumber;

      const response = await whatsapp.sendMessage(options);
      this.logger.log(`[AT WhatsApp] Sent to ${to}`);
      return { success: true, response };
    } catch (err: any) {
      this.logger.error(`[AT WhatsApp] Failed for ${to}: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  private async loadSdk(): Promise<any> {
    // Africa's Talking Node.js SDK
    const AT = require('africastalking');
    return AT({
      apiKey: this.apiKey,
      username: this.username,
    });
  }
}
