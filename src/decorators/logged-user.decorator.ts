import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { LoggedUserOptions } from '@decorators';

/**
 * Decorator para injetar dados do usuário autenticado
 *
 * Extrai os dados do usuário autenticado da request e injeta
 * no parâmetro do controller.
 */
export const LoggedUser = createParamDecorator(
  (data: string | LoggedUserOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Se não tem usuário e é required, lança erro
    const options = typeof data === 'object' ? data : { property: data };
    if (options.required !== false && !user) {
      throw new Error('Usuário não autenticado');
    }

    if (options.property) {
      return user?.[options.property];
    }

    return user;
  },
);
