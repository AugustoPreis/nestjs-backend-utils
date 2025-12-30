import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

/**
 * Interceptor to standardize response format
 *
 * Transforms all application responses into a standardized format
 * with success, data, timestamp and path fields.
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
