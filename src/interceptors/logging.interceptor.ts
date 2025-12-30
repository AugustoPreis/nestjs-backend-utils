import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

/**
 * Interceptor for request logging
 *
 * Logs information about requests and responses,
 * including execution time and filtered sensitive data.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly sensitiveFields = ['password', 'token', 'authorization'];

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    const { method, url, body, query, params } = request;

    this.logger.log(
      `[REQUEST] ${method} ${url}` +
        `\nBody: ${this.filterSensitive(body)}` +
        `\nQuery: ${JSON.stringify(query)}` +
        `\nParams: ${JSON.stringify(params)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `[RESPONSE] ${method} ${url} - ${duration}ms` +
            `\nData: ${JSON.stringify(data).substring(0, 200)}`,
        );
      }),

      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `[ERROR] ${method} ${url} - ${duration}ms` +
            `\nError: ${error.message}`,
        );
        return throwError(() => error);
      }),
    );
  }

  private filterSensitive(obj: unknown): string {
    if (!obj || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }

    const filtered = { ...obj } as Record<string, unknown>;

    this.sensitiveFields.forEach((field) => {
      if (field in filtered) {
        filtered[field] = '***';
      }
    });

    return JSON.stringify(filtered);
  }
}
