import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PREMIUM_ONLY } from '../../../common/decorators/premium-only.decorator';
import { SubscriptionPlan } from '../../agencies/entities/agency.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPremiumOnly = this.reflector.getAllAndOverride<boolean>(PREMIUM_ONLY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isPremiumOnly) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Check if user belongs to an agency and its plan
    // This assumes the user object has the agency data attached (via JWT or previous guard)
    if (!user || !user.agency) {
      throw new ForbiddenException('Information sur l\'agence manquante');
    }

    if (user.agency.subscriptionPlan !== SubscriptionPlan.PREMIUM) {
      throw new ForbiddenException('Cette fonctionnalité nécessite un abonnement PREMIUM');
    }

    // Check expiration
    if (user.agency.subscriptionExpiresAt && new Date(user.agency.subscriptionExpiresAt) < new Date()) {
      throw new ForbiddenException('Votre abonnement PREMIUM a expiré');
    }

    return true;
  }
}
