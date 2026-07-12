import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PREMIUM_ONLY } from '../../../common/decorators/premium-only.decorator';
import { Company } from '../../companies/entities/company.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
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

    if (!user || !user.companyId) {
      throw new ForbiddenException('Accès réservé aux utilisateurs d\'une compagnie');
    }

    // Charger la compagnie depuis la base de données
    const company = await this.companyRepository.findOne({
      where: { id: user.companyId },
    });

    if (!company) {
      throw new ForbiddenException('Compagnie introuvable');
    }

    // Vérifier l'abonnement premium — ici on vérifie via le statut de l'abonnement
    const subscription = await this.companyRepository.manager
      .createQueryBuilder()
      .select()
      .from('subscriptions', 'sub')
      .where('sub.companyId = :companyId', { companyId: user.companyId })
      .andWhere('sub.status = :status', { status: 'ACTIVE' })
      .getRawOne();

    if (!subscription) {
      throw new ForbiddenException('Cette fonctionnalité nécessite un abonnement actif');
    }

    return true;
  }
}
