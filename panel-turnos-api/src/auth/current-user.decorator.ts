// src/auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser() extrae el usuario validado del request (req.user)
 * gracias al JwtAuthGuard. Útil para no tener que hacer:
 *    const user = req.user;
 * en cada método.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
