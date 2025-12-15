import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Guard básico para autenticação JWT
 *
 * Verifica se existe um usuário na request (normalmente injetado
 * por um JwtStrategy ou middleware de autenticação).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return true;
  }
}
