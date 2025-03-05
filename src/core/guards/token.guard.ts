import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

import { SECRET_KEY } from '../decorators';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const secretKey: string = this.reflector.get(SECRET_KEY, context.getHandler());
    const secret = process.env[secretKey];

    if (!secret) {
      throw new Error('Secret key not found in metadata!');
    }

    try {
      const request: Request = context.switchToHttp().getRequest();

      const [_, token] = request.headers.authorization.split(' '); // Bearer <token>
      const verify = jwt.verify(token, secret);
      return true;
    } catch {
      return false;
    }
  }
}
