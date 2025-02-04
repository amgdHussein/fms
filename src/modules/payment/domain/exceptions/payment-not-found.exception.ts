import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentNotFoundException extends HttpException {
  constructor(id: string) {
    super('Not found!', HttpStatus.NOT_FOUND, {
      cause: new Error(`Payment with id (${id}) not found!`),
    });
  }
}
