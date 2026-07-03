import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Counter } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

/**
 * CSRF / cross-origin defense guard.
 *
 * Strategy (because helmet's csurf is unmaintained since helmet v6):
 *   1. Bearer-authenticated requests (mobile, server-to-server) are NEVER
 *      vulnerable to CSRF — the browser auto-cookie vector doesn't exist.
 *      Allow unconditionally.
 *   2. Cookie-authenticated web requests must satisfy BOTH:
 *        - `X-Requested-With: XMLHttpRequest` (set automatically by fetch /
 *          axios libraries; not settable from a cross-origin form/iframe in
 *          modern browsers thanks to CSP).
 *        - `Origin` header matching the configured CORS_ORIGIN.
 *      Reject otherwise.
 *   3. Safe methods (GET / HEAD / OPTIONS) bypass entirely.
 *   4. /metrics and /health are excluded so Prometheus scape / k8s probes
 *      can reach them without a custom header.
 *
 * Atomic metric increments let us alert on emerging cross-origin patterns.
 */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
/**
 * Paths exempt from CSRF check because they are unauthenticated by design
 * (Prometheus scrape, k8s health probes). The list MUST match the value
 * passed to `setGlobalPrefix('api/v1')` in main.ts — without prefix, the
 * guard would reject /api/v1/metrics scrapes because /metrics wouldn't match.
 */
const EXEMPT_PATHS = ['/api/v1/metrics', '/api/v1/health'];
const CSRF_HEADER = 'x-requested-with';

@Injectable()
export class CsrfOriginGuard implements CanActivate {
  constructor(
    @InjectMetric('csrf_rejections_total')
    private readonly rejections: Counter<string>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Record<string, any>>();
    const method = String(request?.method ?? 'GET').toUpperCase();
    const url = String(request?.url ?? request?.originalUrl ?? '');

    if (SAFE_METHODS.has(method)) return true;
    if (EXEMPT_PATHS.some((p) => url.startsWith(p))) return true;

    // Bearer-authenticated clients bypass the check entirely.
    const authHeader = request?.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return true;
    }

    const hasCsrfHeader = request?.headers?.[CSRF_HEADER] === 'XMLHttpRequest';
    const expectedOrigin = process.env.CORS_ORIGIN;
    const origin = request?.headers?.origin ?? request?.headers?.referer;

    if (!hasCsrfHeader) {
      this.rejections.inc({ reason: 'missing-csrf-header', method });
      throw new ForbiddenException('CSRF: missing X-Requested-With header');
    }
    if (expectedOrigin && expectedOrigin !== '*' && origin !== expectedOrigin) {
      this.rejections.inc({ reason: 'cross-origin', method });
      throw new ForbiddenException('CSRF: cross-origin request blocked');
    }
    return true;
  }
}
