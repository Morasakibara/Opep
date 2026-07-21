/**
 * Plan multipliers for per-user rate limiting.
 * Moved from the deleted agencies module – plans are now managed on subscriptions.
 * Legacy `SubscriptionPlan` enum values (BASIC, PREMIUM) are kept for JWT backward compatibility.
 */
export const DEFAULT_QUOTA_MULTIPLIER = 1;

export const QUOTA_MULTIPLIERS: Record<string, number> = {
  BASIC: 1,
  PREMIUM: 3,
  ENTERPRISE: 5,
};
