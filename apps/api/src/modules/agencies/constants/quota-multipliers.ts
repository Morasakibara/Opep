import { SubscriptionPlan } from '../entities/agency.entity';

/**
 * Per-SubscriptionPlan quota multiplier applied to throttler limits.
 *
 * PREMIUM agencies — paying customers — get higher headroom on every tier
 * (long / medium / short / public). BASIC agencies share the baseline.
 *
 * The multiplier is applied by PerUserThrottlerGuard at request time by
 * reading the `plan` claim from the JWT. Since the throttler storage key
 * includes the resolved `limit` value, BASIC and PREMIUM buckets are
 * automatically isolated — they never collide even for the same user/IP.
 */
export const QUOTA_MULTIPLIERS: Readonly<Record<SubscriptionPlan, number>> = {
  [SubscriptionPlan.BASIC]: 1,
  [SubscriptionPlan.PREMIUM]: 3,
};

export const DEFAULT_QUOTA_MULTIPLIER = 1;
