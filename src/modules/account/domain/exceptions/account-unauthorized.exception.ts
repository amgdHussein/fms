import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountNotAuthorizedException extends HttpException {
  constructor(action: string) {
    super('Access Denied', HttpStatus.FORBIDDEN, {
      cause: new Error(`Account is not authorized to perform the action: ${action}`),
    });
  }
}
