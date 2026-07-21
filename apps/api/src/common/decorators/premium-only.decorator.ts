import { SetMetadata } from '@nestjs/common';
import { SubscriptionPlan } from '../../modules/subscriptions/subscriptions.entity';

export const PREMIUM_ONLY = 'premium_only';
export const PremiumOnly = () => SetMetadata(PREMIUM_ONLY, true);
