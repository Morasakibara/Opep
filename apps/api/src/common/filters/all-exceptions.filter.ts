import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { ErrorStoreService } from './error-store.service';

/**
 * Global exception filter that catches ALL unhandled exceptions
 * (both HTTP and non-HTTP) and logs them with full stack trace.
 *
 * This ensures:
 * - No 500 error goes unlogged
 * - Stack traces are captured for debugging
 * - The client receives a sanitised response (no internal details leaked)
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly errorStore?: ErrorStoreService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    // Determine HTTP status code
    let httpStatus: number;
    let message: string;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const responseBody = exception.getResponse();
      message =
        typeof responseBody === 'string'
          ? responseBody
          : (responseBody as any).message || exception.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erreur interne du serveur';
    }

    // Error-level log for 5xx, warn-level for 4xx
    // The NestJS Logger already outputs to the console, so no additional console.* call needed.
    if (httpStatus >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} → ${httpStatus}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else if (httpStatus >= 400) {
      this.logger.warn(`[${request.method}] ${request.url} → ${httpStatus}: ${message}`);
    }

    // Store in error store for monitoring dashboard (only 4xx and 5xx)
    try {
      this.errorStore?.push({
        timestamp: new Date().toISOString(),
        method: request.method,
        url: request.url,
        statusCode: httpStatus,
        message,
        stack: exception instanceof Error ? exception.stack : undefined,
      });
    } catch {
      // Silently fail — the error store should never crash the app
    }

    // Send safe response to client
    const responseBody = {
      statusCode: httpStatus,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    httpAdapter.reply(ctx.getResponse<Response>(), responseBody, httpStatus);
  }
}
