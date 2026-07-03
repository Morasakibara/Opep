import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerGuard,
  ThrottlerStorage,
  type ThrottlerRequest,
} from '@nestjs/throttler';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Counter, Histogram } from 'prom-client';
import * as jwt from 'jsonwebtoken';

import { SubscriptionPlan } from '../../modules/agencies/entities/agency.entity';
import {
  DEFAULT_QUOTA_MULTIPLIER,
  QUOTA_MULTIPLIERS,
} from '../../modules/agencies/constants/quota-multipliers';

/**
 * Combined throttler guard for the OPEP API.
 *
 *  - **Per-user tracker**: GET tracker reads the `Authorization` header to
 *    derive `user:<sub>` (when a valid Bearer token is present) or fall back
 *    to `ip:<req.ip>` for anonymous traffic. JWTs are decoded directly via
 *    jsonwebtoken + ConfigService (not JwtService) because NestJS APP_GUARDs
 *    run BEFORE class/method-level JwtAuthGuard — `req.user` would be
 *    undefined at this point, and the JwtModule in AuthModule is not global.
 *
 *  - **Per-agency quota**: handleRequest multiplies the effective `limit` by
 *    the agency subscription plan multiplier (PREMIUM=3, BASIC=1). The
 *    underlying throttler `increment()` storage key includes the resolved
 *    limit, so BASIC and PREMIUM buckets are automatically isolated for the
 *    same user/IP — no manual key namespacing required.
 *
 *  - **Prometheus metrics**: every tier check increments
 *    `throttler_hits_total{tier,route,tracker,result}` and the histogram
 *    `throttler_request_duration_seconds{tier,route}` observes the wall time
 *    (including the Redis storage round-trip). Labels are deliberately
 *    low-cardinality to avoid Prometheus memory blow-up.
 */
/** Hidden property used to memoize the JWT decode across all guard calls
 *  within a single request lifecycle (getTracker, handleRequest, helpers).
 *  Without this, the same JWT is `verify()`-ed up to 12 times per request
 *  (4 tiers × 3 helpers). Presence of the key means we already attempted
 *  decode at least once — `null` and an object are both valid cached values. */
const JWT_CACHE_KEY = '_opepJwtPayload';

@Injectable()
export class PerUserThrottlerGuard extends ThrottlerGuard {
  private readonly jwtSecret: string;

  constructor(
    @InjectThrottlerOptions() options: any,
    @InjectThrottlerStorage() storage: ThrottlerStorage,
    reflector: Reflector,
    private readonly configService: ConfigService,
    @InjectMetric('throttler_hits_total') private readonly hitsCounter: Counter<string>,
    @InjectMetric('throttler_request_duration_seconds')
    private readonly durationHistogram: Histogram<string>,
  ) {
    super(options, storage, reflector);
    const secret = this.configService.get<string>('JWT_SECRET', '');
    if (!secret) {
      throw new Error(
        'PerUserThrottlerGuard requires JWT_SECRET env var to verify tokens and derive per-user tracker keys.',
      );
    }
    this.jwtSecret = secret;
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const payload = this.decodeJwtCached(req);
    if (payload?.sub) {
      return `user:${payload.sub}`;
    }
    return `ip:${req?.ip ?? 'unknown'}`;
  }

  protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const tier = String((requestProps.throttler as { name?: string })?.name ?? 'default');
    const route = this.routeLabelFromContext(requestProps.context);
    const trackerKind = this.trackerKindLabel(requestProps.context);
    const multiplier = this.resolveMultiplier(requestProps.context);
    const adjustedProps: ThrottlerRequest =
      multiplier === 1
        ? requestProps
        : {
            ...requestProps,
            limit: Math.max(1, Math.ceil(requestProps.limit * multiplier)),
          };

    const endTimer = this.durationHistogram.startTimer({ tier, route });
    let throttled = false;
    try {
      const allowed = await super.handleRequest(adjustedProps);
      if (!allowed) {
        throttled = true;
      }
      return allowed;
    } catch (err) {
      // super.handleRequest only throws ThrottlerException (the 429 path).
      // Any other error is a real bug — log once via metric and bubble.
      throttled = true;
      throw err;
    } finally {
      this.hitsCounter.inc({
        tier,
        route,
        tracker: trackerKind,
        result: throttled ? 'throttled' : 'allow',
      });
      endTimer({ tier, route, result: throttled ? 'throttled' : 'allow' });
    }
  }

  /**
   * Decode the JWT from the request once, cache the result on `req` for the
   * remainder of the request lifecycle, and return it. Cache uses `'in'`
   * rather than truthy check so a `null` cached value (no Bearer / invalid
   * token) is also reused — preventing redundant re-verify attempts.
   */
  private decodeJwtCached(req: Record<string, any>): jwt.JwtPayload | null {
    if (req && Object.prototype.hasOwnProperty.call(req, JWT_CACHE_KEY)) {
      return (req as Record<string, unknown>)[JWT_CACHE_KEY] as jwt.JwtPayload | null;
    }

    let result: jwt.JwtPayload | null = null;
    const authHeader = req?.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload | string;
        if (typeof payload === 'object' && payload !== null) {
          result = payload;
        }
      } catch {
        // Invalid/expired token — caller falls back to IP tracking.
        // Intentional: an attacker spoofing an invalid token simply gets
        // bucketed by IP like an anonymous client.
      }
    }

    if (req) {
      (req as Record<string, unknown>)[JWT_CACHE_KEY] = result;
    }
    return result;
  }

  private resolveMultiplier(context: ThrottlerRequest['context']): number {
    if (context.getType() !== 'http') {
      return DEFAULT_QUOTA_MULTIPLIER;
    }
    const req = context.switchToHttp().getRequest<Record<string, any>>();
    const payload = this.decodeJwtCached(req);
    const rawPlan = payload?.plan;
    if (typeof rawPlan !== 'string') {
      return DEFAULT_QUOTA_MULTIPLIER;
    }
    if (rawPlan in QUOTA_MULTIPLIERS) {
      return QUOTA_MULTIPLIERS[rawPlan as SubscriptionPlan];
    }
    return DEFAULT_QUOTA_MULTIPLIER;
  }

  private routeLabelFromContext(context: ThrottlerRequest['context']): string {
    if (context.getType() !== 'http') {
      return 'non-http';
    }
    const req = context.switchToHttp().getRequest<Record<string, any>>();
    // Express attaches req.route during routing; before that we fall back to
    // the raw HTTP method. Using the route pattern (POST /users/:id) instead
    // of the resolved URL prevents path-param label cardinality explosion.
    const handler = req?.route?.options?.method ?? req?.method ?? 'unknown';
    const controller = (req?.route?.options?.controller?.name ??
      context.getClass?.()?.name ??
      'controller') as string;
    return `${controller}.${handler}`.toLowerCase();
  }

  private trackerKindLabel(context: ThrottlerRequest['context']): 'user' | 'ip' {
    if (context.getType() !== 'http') return 'ip';
    const req = context.switchToHttp().getRequest<Record<string, any>>();
    return this.decodeJwtCached(req)?.sub ? 'user' : 'ip';
  }
}
