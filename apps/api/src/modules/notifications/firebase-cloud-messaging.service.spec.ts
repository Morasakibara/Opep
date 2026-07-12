import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FirebaseCloudMessagingService } from './firebase-cloud-messaging.service';

describe('FirebaseCloudMessagingService', () => {
  let service: FirebaseCloudMessagingService;
  let configService: ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    const module = await Test.createTestingModule({
      providers: [
        FirebaseCloudMessagingService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, def?: any) => {
              if (key === 'FCM_ACTIVE') return 'false'; // Mock mode
              if (key === 'FCM_CREDENTIALS') return def;
              return def;
            }),
          },
        },
      ],
    }).compile();

    service = module.get(FirebaseCloudMessagingService);
    configService = module.get(ConfigService);
  });

  describe('sendPush (mock mode)', () => {
    it('returns success in mock mode without calling Firebase', async () => {
      const result = await service.sendPush('fake-token-123', {
        title: 'Test Title',
        body: 'Test Body',
        data: { type: 'DEPARTURE_1H', reservationId: 'res-1', tripId: 'trip-1' },
      });

      expect(result).toEqual({ success: true });
    });

    it('handles empty title gracefully', async () => {
      const result = await service.sendPush('fake-token-123', {
        title: '',
        body: 'Test Body',
      });

      expect(result.success).toBe(true);
    });

    it('handles empty body gracefully', async () => {
      const result = await service.sendPush('fake-token-123', {
        title: 'Test',
        body: '',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('sendMulticast (mock mode)', () => {
    it('returns success for multiple tokens in mock mode', async () => {
      const result = await service.sendMulticast(
        ['token-1', 'token-2', 'token-3'],
        { title: 'Multicast', body: 'To many devices' },
      );

      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(result.errors).toBeUndefined();
    });

    it('handles empty tokens array', async () => {
      const result = await service.sendMulticast([], {
        title: 'Empty',
        body: 'No tokens',
      });

      expect(result.successCount).toBe(0);
      expect(result.failureCount).toBe(0);
    });
  });

  describe('production mode', () => {
    it('falls back to mock when firebase-admin module cannot be loaded', async () => {
      // Re-create service with active=true to test fallback
      const module = await Test.createTestingModule({
        providers: [
          FirebaseCloudMessagingService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string, def?: any) => {
                if (key === 'FCM_ACTIVE') return 'true';
                return def;
              }),
            },
          },
        ],
      }).compile();

      const prodService = module.get(FirebaseCloudMessagingService);
      const result = await prodService.sendPush('some-token', {
        title: 'Prod test',
        body: 'Should fallback gracefully',
      });

      // Should still return success (graceful fallback)
      expect(result.success).toBe(true);
    });
  });
});
