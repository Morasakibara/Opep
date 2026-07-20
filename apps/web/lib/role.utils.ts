/**
 * Role utility helpers.
 * Must match UserRole enum from @opep/shared-types.
 * NOTE: Also available as shared-types export; this local copy
 * avoids the need to rebuild the shared package on every change.
 */
export type Role = 'ADMIN_PLATFORM' | 'COMPANY_DIRECTOR' | 'CENTRE_MANAGER' | 'AGENCY_MANAGER' | 'CASHIER' | 'CONTROLLER' | 'DRIVER' | 'CLIENT';

const ADMIN_ROLES: Role[] = ['ADMIN_PLATFORM', 'COMPANY_DIRECTOR', 'CENTRE_MANAGER', 'AGENCY_MANAGER'];

export function isAdminRole(role?: string): boolean {
  return ADMIN_ROLES.includes(role as Role);
}

export function isStaffRole(role?: string): boolean {
  if (!role) return false;
  return !['CLIENT', 'DRIVER'].includes(role);
}

export function hasRole(role: string | undefined, expected: Role | Role[]): boolean {
  if (!role) return false;
  if (Array.isArray(expected)) {
    return expected.includes(role as Role);
  }
  return role === expected;
}
