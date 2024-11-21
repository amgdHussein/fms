import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountInactiveException extends HttpException {
  constructor(id: string) {
    super('Bad Request', HttpStatus.BAD_REQUEST, {
      cause: new Error(`Account with id (${id}) is not active!`),
    });
  }
}
