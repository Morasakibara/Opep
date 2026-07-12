import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@opep/shared-types';

/**
 * Verifies resource ownership based on user role:
 * - ADMIN_PLATFORM → full access
 * - COMPANY_DIRECTOR → can only access own companyId and its centres
 * - CENTRE_MANAGER → can only access own centreId
 * - CLIENT → passes (ownership checked at service level)
 *
 * Usage: @UseGuards(OwnershipGuard) after JwtAuthGuard + RolesGuard
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    // Admin platform can access everything
    if (user.role === UserRole.ADMIN_PLATFORM) {
      return true;
    }

    // CLIENT — let through, checked at service level
    if (user.role === UserRole.CLIENT) {
      return true;
    }

    const params = request.params || {};
    const body = request.body || {};
    const query = request.query || {};

    // Extract requested resource IDs
    const resourceCompanyId = params.companyId || body.companyId || query.companyId;
    const resourceCentreId = params.centreId || body.centreId || query.centreId;

    if (user.role === UserRole.COMPANY_DIRECTOR) {
      if (!user.companyId) {
        throw new ForbiddenException('Directeur non rattaché à une compagnie');
      }
      // If a companyId is specified, it must match
      if (resourceCompanyId && resourceCompanyId !== user.companyId) {
        throw new ForbiddenException('Accès refusé : compagnie non autorisée');
      }
      // If a centreId is specified, verify it belongs to user's company
      if (resourceCentreId && !resourceCompanyId) {
        // Check that the centre belongs to user's company
        // This requires a DB lookup, done at service level
        return true; // Pass to service for detailed check
      }
      return true;
    }

    if (user.role === UserRole.CENTRE_MANAGER) {
      if (!user.centreId) {
        throw new ForbiddenException('Manager non rattaché à un centre');
      }
      if (resourceCentreId && resourceCentreId !== user.centreId) {
        throw new ForbiddenException('Accès refusé : centre non autorisé');
      }
      return true;
    }

    return true;
  }
}
