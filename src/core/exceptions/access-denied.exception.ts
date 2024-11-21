import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(cause: string) {
    super('Access Denied', HttpStatus.FORBIDDEN, {
      cause: new Error(cause),
    });
  }
}
