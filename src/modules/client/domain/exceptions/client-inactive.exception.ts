import { HttpException, HttpStatus } from '@nestjs/common';

export class ClientInactiveException extends HttpException {
  constructor(id: string) {
    super('Bad Request', HttpStatus.BAD_REQUEST, {
      cause: new Error(`Client with id (${id}) is not active!`),
    });
  }
}
