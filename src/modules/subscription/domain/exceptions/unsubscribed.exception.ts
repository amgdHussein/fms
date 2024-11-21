import { HttpException, HttpStatus } from '@nestjs/common';

export class UnsubscribedException extends HttpException {
  constructor() {
    super('Bad Request', HttpStatus.BAD_REQUEST, {
      cause: new Error(`User is not subscribed to any plan.`),
    });
  }
}
