import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotAuthorizedException extends HttpException {
  constructor(action: string) {
    super('Access Denied', HttpStatus.FORBIDDEN, {
      cause: new Error(`User is not authorized to perform the action: ${action}`),
    });
  }
}
