import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
  constructor(cause: string) {
    super('Internal Server Error!', HttpStatus.INTERNAL_SERVER_ERROR, {
      cause: new Error(cause),
    });
  }
}
