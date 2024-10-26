import { HttpException, HttpStatus } from '@nestjs/common';

export class UserInactiveException extends HttpException {
  constructor(id: string) {
    super('Bad Request', HttpStatus.BAD_REQUEST, {
      cause: new Error(`User with id (${id}) is not active!`),
    });
  }
}
