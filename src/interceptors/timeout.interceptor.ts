import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

/**
 * Interceptor for request timeout
 *
 * Defines a maximum execution time for requests,
 * throwing TimeoutException when exceeded.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  public constructor(private readonly timeoutMs: number = 30000) {}

  public intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                `The server query exceeded the timeout limit of ${this.timeoutMs}ms`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
