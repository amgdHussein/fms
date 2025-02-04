import { HttpException, HttpStatus } from '@nestjs/common';

export class ReceiptNotFoundException extends HttpException {
  constructor(id: string) {
    super('Not found!', HttpStatus.NOT_FOUND, {
      cause: new Error(`Receipt with id (${id}) not found!`),
    });
  }
}
