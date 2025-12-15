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
 * Interceptor para timeout de requisições
 *
 * Define um tempo máximo de execução para requisições,
 * lançando TimeoutException quando excedido.
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
                `A consulta ao servidor excedeu o tempo limite de ${this.timeoutMs}ms`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
