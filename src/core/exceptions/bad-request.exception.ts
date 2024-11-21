import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(cause: string) {
    super('Bad Request!', HttpStatus.BAD_REQUEST, {
      cause: new Error(cause),
    });
  }
}
