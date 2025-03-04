import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_STRATEGY } from '../constants';
import { PUBLIC_KEY } from '../decorators';

@Injectable()
export class AuthenticationGuard extends AuthGuard(AUTH_STRATEGY) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) return true; // Skip authentication for public routes

    // Skip authentication for development environment
    // if (process.env.NODE_ENV == Environment.DEV) return true; //TODO: I NEED THE USER IN TEST ALSO

    const isValid = await super.canActivate(context);

    if (isValid) return true; // Authentication succeeded, and user ID is updated in the request
    return false; // Authentication failed
  }
}
