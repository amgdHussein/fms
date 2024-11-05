import { HttpException, HttpStatus } from '@nestjs/common';

export class InvoiceNotFoundException extends HttpException {
  constructor(id: string) {
    super('Not found!', HttpStatus.NOT_FOUND, {
      cause: new Error(`Invoice with id (${id}) not found!`),
    });
  }
}
