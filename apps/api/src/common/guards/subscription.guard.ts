import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../modules/subscriptions/subscriptions.entity';
import { SubscriptionStatus } from '@opep/shared-types';

/**
 * Blocks write operations (POST, PATCH, PUT, DELETE) when the user's
 * company subscription is not ACTIVE or TRIALING.
 *
 * Read operations (GET) are always allowed.
 */
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Always allow reads
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return true;
    }

    const user = request.user;
    if (!user || !user.companyId) {
      return true; // No company context for this user
    }

    // Find the active subscription for this company
    const subscription = await this.subscriptionRepository.findOne({
      where: { company: { id: user.companyId } },
      order: { createdAt: 'DESC' },
    });

    if (!subscription) {
      throw new ForbiddenException(
        'Aucun abonnement trouvé pour cette compagnie. Contactez l\'administration.',
      );
    }

    const activeStatuses: string[] = [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.TRIALING,
    ];
    if (!activeStatuses.includes(subscription.status)) {
      throw new ForbiddenException(
        'Abonnement ' + subscription.status +
        '. Écritures bloquées. Régularisez votre abonnement.',
      );
    }

    return true;
  }
}
