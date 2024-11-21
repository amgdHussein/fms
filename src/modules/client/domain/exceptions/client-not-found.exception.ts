import { HttpException, HttpStatus } from '@nestjs/common';

export class ClientNotFoundException extends HttpException {
  constructor(id: string) {
    super('Not found!', HttpStatus.NOT_FOUND, {
      cause: new Error(`Client with id (${id}) not found!`),
    });
  }
}
