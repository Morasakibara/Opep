/**
 * Role utility helpers.
 * Must match UserRole enum exported from this package.
 */
export type Role = 'ADMIN_PLATFORM' | 'COMPANY_DIRECTOR' | 'CENTRE_MANAGER' | 'AGENCY_MANAGER' | 'CASHIER' | 'CONTROLLER' | 'DRIVER' | 'CLIENT';

const ADMIN_ROLES: Role[] = ['ADMIN_PLATFORM', 'COMPANY_DIRECTOR', 'CENTRE_MANAGER', 'AGENCY_MANAGER'];

/**
 * Check if a role has administrative privileges.
 * Admin roles can access management features and see all data.
 */
export function isAdminRole(role?: string): boolean {
  return ADMIN_ROLES.includes(role as Role);
}

/**
 * Check if a role is a staff role (admin/manager/cashier/controller).
 */
export function isStaffRole(role?: string): boolean {
  if (!role) return false;
  return !['CLIENT', 'DRIVER'].includes(role);
}

/**
 * Check if a role matches any of the given expected roles.
 */
export function hasRole(role: string | undefined, expected: Role | Role[]): boolean {
  if (!role) return false;
  if (Array.isArray(expected)) {
    return expected.includes(role as Role);
  }
  return role === expected;
}
