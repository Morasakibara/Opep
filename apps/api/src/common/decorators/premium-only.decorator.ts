import { SetMetadata } from '@nestjs/common';
import { SubscriptionPlan } from '../../modules/agencies/entities/agency.entity';

export const PREMIUM_ONLY = 'premium_only';
export const PremiumOnly = () => SetMetadata(PREMIUM_ONLY, true);
