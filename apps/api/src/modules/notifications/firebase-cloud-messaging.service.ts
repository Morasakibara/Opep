import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Firebase Cloud Messaging (FCM) service for sending push notifications
 * to mobile devices via Firebase Cloud Messaging.
 *
 * In production, initialise the Firebase Admin SDK with a service account
 * JSON file. In development mode the service falls back to console.log
 * (no network call).
 *
 * Environment variables:
 *   FCM_ACTIVE        – set to 'true' to hit the real Firebase API
 *   FCM_CREDENTIALS   – path to Firebase service account JSON, or inline JSON
 */
@Injectable()
export class FirebaseCloudMessagingService {
  private readonly logger = new Logger(FirebaseCloudMessagingService.name);
  private active: boolean;
  private firebaseApp: any = null;

  constructor(private readonly configService: ConfigService) {
    this.active = configService.get<string>('FCM_ACTIVE') === 'true';

    if (this.active) {
      try {
        // Dynamic require - Firebase Admin SDK may not be installed in dev
        const admin = require('firebase-admin');

        // Check if already initialised (e.g. by another module)
        if (admin.apps.length === 0) {
          const credentialsPath = configService.get<string>('FCM_CREDENTIALS');

          if (credentialsPath) {
            // Load from file path
            const serviceAccount = require(credentialsPath);
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
            });
          } else {
            // Try loading from GOOGLE_APPLICATION_CREDENTIALS env var
            admin.initializeApp();
          }
          this.logger.log('[FCM] Firebase Admin SDK initialised');
        } else {
          this.logger.log('[FCM] Firebase Admin SDK already initialised');
        }

        this.firebaseApp = admin;
      } catch (err: any) {
        this.logger.warn(
          `[FCM] Firebase Admin SDK could not be loaded: ${err.message}. Push notifications will fall back to mock mode.`,
        );
        this.active = false;
      }
    } else {
      this.logger.log('[FCM] Running in mock mode — push notifications will be logged');
    }
  }

  /**
   * Send a push notification to a specific device via FCM.
   */
  async sendPush(
    token: string,
    payload: {
      title: string;
      body: string;
      data?: Record<string, string>;
    },
  ): Promise<{ success: boolean; response?: any; error?: string }> {
    if (!this.active || !this.firebaseApp) {
      this.logger.log(
        `[FCM Mock] Push to token=${token.substring(0, 8)}... | Title: ${payload.title} | Body: ${payload.body}`,
      );
      return { success: true };
    }

    try {
      const message: any = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        token,
      };

      if (payload.data) {
        message.data = payload.data;
      }

      const response = await this.firebaseApp.messaging().send(message);
      this.logger.log(`[FCM] Push sent successfully: ${response}`);
      return { success: true, response };
    } catch (err: any) {
      this.logger.error(`[FCM] Failed to send push: ${err.message}`);

      // Handle specific FCM errors
      if (err.code === 'messaging/registration-token-not-registered') {
        this.logger.warn(`[FCM] Token ${token.substring(0, 8)}... is no longer registered`);
      }

      return { success: false, error: err.message };
    }
  }

  /**
   * Send a push notification to multiple devices (topic-based multicast).
   */
  async sendMulticast(
    tokens: string[],
    payload: {
      title: string;
      body: string;
      data?: Record<string, string>;
    },
  ): Promise<{ successCount: number; failureCount: number; errors?: string[] }> {
    if (!this.active || !this.firebaseApp || tokens.length === 0) {
      this.logger.log(
        `[FCM Mock] Multicast to ${tokens.length} devices | Title: ${payload.title}`,
      );
      return { successCount: tokens.length, failureCount: 0 };
    }

    try {
      const message: any = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        tokens, // FCM v1 uses `tokens` for multicast
      };

      if (payload.data) {
        message.data = payload.data;
      }

      const response = await this.firebaseApp.messaging().sendEachForMulticast(message);
      this.logger.log(`[FCM] Multicast: ${response.successCount} sent, ${response.failureCount} failed`);
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        errors: response.responses
          ?.filter((r: any) => !r.success)
          .map((r: any) => r.error?.message),
      };
    } catch (err: any) {
      this.logger.error(`[FCM] Multicast failed: ${err.message}`);
      return { successCount: 0, failureCount: tokens.length, errors: [err.message] };
    }
  }
}
