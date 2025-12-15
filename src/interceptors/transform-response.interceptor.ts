import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

/**
 * Interceptor para padronizar formato de resposta
 *
 * Transforma todas as respostas da aplicação em um formato padronizado
 * com campos success, data, timestamp e path.
 */
@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  unknown
> {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
