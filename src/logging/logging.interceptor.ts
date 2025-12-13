import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, body, query } = request;
    const startTime = Date.now();

    // Skip logging for health check endpoint every 30 seconds
    const isHealthCheck = url === '/' && method === 'GET';

    if (!isHealthCheck) {
      this.logger.log(`→ ${method} ${url}`, 'LoggingInterceptor');

      // Debug
      // this.logger.debug(
      //   `  [Debug] body type: ${typeof body}, has body: ${!!body}, keys: ${body ? Object.keys(body).length : 0}`,
      //   'LoggingInterceptor',
      // );
    }

    // Log query parameters
    if (!isHealthCheck && Object.keys(query).length > 0) {
      this.logger.log(`  Query: ${JSON.stringify(query)}`, 'LoggingInterceptor');
    }

    // Log body
    if (!isHealthCheck && body && typeof body === 'object' && Object.keys(body).length > 0) {
      const sanitizedBody = this.sanitizeBody(body as Record<string, unknown>);
      this.logger.log(`  Body: ${JSON.stringify(sanitizedBody)}`, 'LoggingInterceptor');
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          if (!isHealthCheck) {
            this.logger.log(
              `← ${method} ${url} - ${statusCode} - ${duration}ms`,
              'LoggingInterceptor',
            );
          }

          if (duration > 1000) {
            this.logger.warn(
              `⚠️  Slow request: ${method} ${url} took ${duration}ms`,
              'LoggingInterceptor',
            );
          }
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `← ${method} ${url} - ERROR - ${duration}ms - ${error.message}`,
            error.stack,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }

  // Sanitize sensitive data from request body
  private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
    const sensitiveFields = [
      'password',
      'oldPassword',
      'newPassword',
      'token',
      'refreshToken',
      'accessToken',
      'secret',
      'apiKey',
    ];

    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '***';
      }
    });

    return sanitized;
  }
}
