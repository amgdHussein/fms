import { HttpException, HttpStatus } from '@nestjs/common';

export class CodeNotFoundException extends HttpException {
  constructor(id: string) {
    super('Not found!', HttpStatus.NOT_FOUND, {
      cause: new Error(`Code with id (${id}) not found!`),
    });
  }
}
