import { Test, TestingModule } from '@nestjs/testing';
import { LoginAttemptService } from './login-attempt.service';
import { REDIS_CLIENT } from '../../../common/redis/redis.module';

const mockRedis = {
  incr: jest.fn(),
  expire: jest.fn(),
  ttl: jest.fn(),
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
};

describe('LoginAttemptService', () => {
  let service: LoginAttemptService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginAttemptService,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<LoginAttemptService>(LoginAttemptService);
  });

  describe('recordFailedAttempt', () => {
    it('should increment attempts and return the count', async () => {
      mockRedis.incr.mockResolvedValue(3);
      mockRedis.expire.mockResolvedValue(1);

      const count = await service.recordFailedAttempt('user@test.com');
      expect(count).toBe(3);
      expect(mockRedis.incr).toHaveBeenCalledWith('login_attempts:user@test.com');
    });

    it('should set TTL on first attempt', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      await service.recordFailedAttempt('user@test.com');
      expect(mockRedis.expire).toHaveBeenCalled();
    });
  });

  describe('isLocked', () => {
    it('should return locked=true when lock key has TTL', async () => {
      mockRedis.ttl.mockResolvedValue(600); // 10 min remaining

      const result = await service.isLocked('user@test.com');
      expect(result.locked).toBe(true);
      expect(result.remainingSeconds).toBe(600);
    });

    it('should lock account when attempts exceed max', async () => {
      mockRedis.ttl.mockResolvedValue(-2); // Key doesn't exist
      mockRedis.get.mockResolvedValue('5'); // 5 attempts = max
      mockRedis.setex.mockResolvedValue('OK');
      mockRedis.del.mockResolvedValue(1);

      const result = await service.isLocked('user@test.com');
      expect(result.locked).toBe(true);
      expect(result.remainingSeconds).toBe(900); // 15 minutes
      expect(mockRedis.setex).toHaveBeenCalled();
    });

    it('should return locked=false when no lock and under max attempts', async () => {
      mockRedis.ttl.mockResolvedValue(-2);
      mockRedis.get.mockResolvedValue('3'); // 3 < 5 max

      const result = await service.isLocked('user@test.com');
      expect(result.locked).toBe(false);
    });
  });

  describe('clearAttempts', () => {
    it('should delete both attempt and lock keys', async () => {
      mockRedis.del.mockResolvedValue(2);

      await service.clearAttempts('user@test.com');
      expect(mockRedis.del).toHaveBeenCalledWith('login_attempts:user@test.com');
      expect(mockRedis.del).toHaveBeenCalledWith('login_locked:user@test.com');
    });
  });
});
