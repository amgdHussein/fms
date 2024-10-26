import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super('Not found!', HttpStatus.NOT_FOUND, {
      cause: new Error(`User with id (${id}) not found!`),
    });
  }
}
