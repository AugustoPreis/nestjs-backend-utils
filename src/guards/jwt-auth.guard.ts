import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Basic guard for JWT authentication
 *
 * Checks if there is a user in the request (normally injected
 * by a JwtStrategy or authentication middleware).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return true;
  }
}
