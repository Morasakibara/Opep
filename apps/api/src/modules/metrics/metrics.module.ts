import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

const THROTTLER_HITS_METRIC = 'PROM_METRIC_THROTTLER_HITS_TOTAL';
const THROTTLER_DURATION_METRIC = 'PROM_METRIC_THROTTLER_REQUEST_DURATION_SECONDS';
const CSRF_REJECTIONS_METRIC = 'PROM_METRIC_CSRF_REJECTIONS_TOTAL';

/**
 * Prometheus observability for the OPEP API.
 *
 * Registers two throttler-related instruments. The /metrics endpoint is
 * exposed automatically by PrometheusModule on a controller-derived path
 * (no auth required by default; protected at proxy level).
 *
 * Labels are deliberately low-cardinality:
 *   tier     — { long, medium, short, public }
 *   route    — controller.method (not raw URL — avoids path-param explosion)
 *   tracker  — { user, ip } (NOT user_id — would explode Prometheus memory)
 *
 * Histogram bucket set covers sub-millisecond Redis storage hits through the
 * long-tail error path (500ms).
 */
@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      defaultLabels: { service: 'opep-api' },
      path: '/metrics',
    }),
  ],
  providers: [
    makeCounterProvider({
      name: 'throttler_hits_total',
      help: 'Total throttler checks performed, labeled by tier, route and tracker class.',
      labelNames: ['tier', 'route', 'tracker', 'result'],
    }),
    makeHistogramProvider({
      name: 'throttler_request_duration_seconds',
      help: 'Duration of throttler.handleRequest execution (incl. Redis storage round-trip).',
      labelNames: ['tier', 'route', 'result'],
      buckets: [0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5],
    }),
    makeCounterProvider({
      name: 'csrf_rejections_total',
      help: 'Requests rejected by the CSRF origin guard, labeled by reason.',
      labelNames: ['reason', 'method'],
    }),
  ],
  exports: [
    PrometheusModule,
    THROTTLER_HITS_METRIC,
    THROTTLER_DURATION_METRIC,
    CSRF_REJECTIONS_METRIC,
  ],
})
export class MetricsModule {}
