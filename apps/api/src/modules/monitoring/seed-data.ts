/**
 * Données de seed partagées pour les erreurs de monitoring.
 * Utilisé à la fois par :
 * - MonitoringController.seedErrors() (endpoint HTTP)
 * - scripts/seed-monitoring.ts (script CLI)
 */

export interface SeedErrorInput {
  method: string;
  url: string;
  statusCode: number;
  message: string;
}

export const MONITORING_SEED_ERRORS: SeedErrorInput[] = [
  { method: 'GET', url: '/api/v1/companies', statusCode: 500, message: 'Cannot read properties of undefined' },
  { method: 'POST', url: '/api/v1/reservations', statusCode: 400, message: 'Validation failed: seatId must be a string' },
  { method: 'GET', url: '/api/v1/users/me', statusCode: 401, message: 'Invalid or expired token' },
  { method: 'GET', url: '/api/v1/trips/search?from=Douala&to=Yaounde', statusCode: 404, message: 'Route not found: Douala → Yaounde' },
  { method: 'PUT', url: '/api/v1/buses/LT-001-AA', statusCode: 500, message: 'Database connection timeout' },
  { method: 'DELETE', url: '/api/v1/tickets/INVALID', statusCode: 400, message: 'Invalid ticket format' },
  { method: 'POST', url: '/api/v1/payments/initiate', statusCode: 502, message: 'Upstream provider timeout: MTN Mobile Money' },
  { method: 'PATCH', url: '/api/v1/trips/abc123/status', statusCode: 403, message: 'Insufficient permissions: only managers can update trip status' },
  { method: 'GET', url: '/api/v1/reports/revenue?period=invalid', statusCode: 422, message: 'Invalid period format' },
  { method: 'POST', url: '/api/v1/auth/login', statusCode: 429, message: 'Too many login attempts. Try again in 60 seconds' },
];
