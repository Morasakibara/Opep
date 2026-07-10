import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../common/redis/redis.module';

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_SECONDS = 15 * 60; // 15 minutes
const ATTEMPT_WINDOW_SECONDS = 15 * 60; // 15 minutes sliding window

@Injectable()
export class LoginAttemptService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  /**
   * Record a failed login attempt for the given identifier (phone/email).
   * Returns the current attempt count after incrementing.
   */
  async recordFailedAttempt(identifier: string): Promise<number> {
    const key = `login_attempts:${identifier}`;
    const attempts = await this.redis.incr(key);
    // Set TTL on first attempt (expires after window)
    if (attempts === 1) {
      await this.redis.expire(key, ATTEMPT_WINDOW_SECONDS);
    }
    return attempts;
  }

  /**
   * Check if the given identifier is currently locked due to too many failed attempts.
   * Also returns the remaining lock time in seconds if locked.
   */
  async isLocked(identifier: string): Promise<{ locked: boolean; remainingSeconds: number }> {
    const lockKey = `login_locked:${identifier}`;
    const ttl = await this.redis.ttl(lockKey);
    if (ttl > 0) {
      return { locked: true, remainingSeconds: ttl };
    }
    // Check if attempt count exceeds max within the window
    const attemptsKey = `login_attempts:${identifier}`;
    const attempts = await this.redis.get(attemptsKey);
    if (attempts && parseInt(attempts, 10) >= MAX_ATTEMPTS) {
      // Lock the account now
      await this.redis.setex(lockKey, LOCK_DURATION_SECONDS, '1');
      // Clean up the attempts counter
      await this.redis.del(attemptsKey);
      return { locked: true, remainingSeconds: LOCK_DURATION_SECONDS };
    }
    return { locked: false, remainingSeconds: 0 };
  }

  /**
   * Clear the login attempts and lock for the given identifier (on successful login).
   */
  async clearAttempts(identifier: string): Promise<void> {
    await this.redis.del(`login_attempts:${identifier}`);
    await this.redis.del(`login_locked:${identifier}`);
  }
}
