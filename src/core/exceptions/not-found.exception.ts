import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(cause: string) {
    super('Not found!', HttpStatus.NOT_FOUND, {
      cause: new Error(cause),
    });
  }
}
