import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PREMIUM_ONLY } from '../../../common/decorators/premium-only.decorator';
import { Agency, SubscriptionPlan } from '../../agencies/entities/agency.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPremiumOnly = this.reflector.getAllAndOverride<boolean>(PREMIUM_ONLY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isPremiumOnly) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.agencyId) {
      throw new ForbiddenException('Accès réservé aux utilisateurs d\'une agence');
    }

    // Charger l'agence depuis la base de données
    const agency = await this.agencyRepository.findOne({
      where: { id: user.agencyId },
    });

    if (!agency) {
      throw new ForbiddenException('Agence introuvable');
    }

    if (agency.subscriptionPlan !== SubscriptionPlan.PREMIUM) {
      throw new ForbiddenException('Cette fonctionnalité nécessite un abonnement PREMIUM');
    }

    // Vérifier l'expiration
    if (agency.subscriptionExpiresAt && new Date(agency.subscriptionExpiresAt) < new Date()) {
      throw new ForbiddenException('Votre abonnement PREMIUM a expiré');
    }

    return true;
  }
}
