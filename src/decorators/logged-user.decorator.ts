import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { LoggedUserOptions } from './interfaces/logged-user-options.interface';

/**
 * Decorator to inject authenticated user data
 *
 * Extracts authenticated user data from the request and injects
 * it into the controller parameter.
 */
export const LoggedUser = createParamDecorator(
  (data: string | LoggedUserOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If there is no user and it is required, throw an error
    const options = typeof data === 'object' ? data : { property: data };
    if (options.required !== false && !user) {
      throw new Error('User not authenticated');
    }

    if (options.property) {
      return user?.[options.property];
    }

    return user;
  },
);
