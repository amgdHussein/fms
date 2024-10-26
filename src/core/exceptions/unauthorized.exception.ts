import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(cause: string) {
    super('Unauthorized!', HttpStatus.UNAUTHORIZED, {
      cause: new Error(cause),
    });
  }
}
