import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@opep/shared-types';

@Injectable()
export class AgencyOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Les admins plateforme ont accès à tout
    if (user.role === UserRole.ADMIN_PLATFORM) {
      return true;
    }

    // Pour les autres rôles agence, on vérifie qu'ils ont une agence
    if (!user.agencyId) {
      throw new ForbiddenException('Utilisateur non rattaché à une agence');
    }

    // Si la requête contient un agencyId en paramètre ou body, on compare
    const resourceAgencyId = request.params.agencyId || request.body.agencyId;
    
    if (resourceAgencyId && resourceAgencyId !== user.agencyId) {
      throw new ForbiddenException('Accès refusé : ressource appartenant à une autre agence');
    }

    return true;
  }
}
