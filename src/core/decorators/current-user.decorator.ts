import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function CurrentUser(): ParameterDecorator {
  return createParamDecorator((data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp().getRequest();
    console.log('user', ctx.user);
    return ctx.user;
  })();
}
