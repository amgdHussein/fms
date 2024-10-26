import { HttpException, HttpStatus } from '@nestjs/common';

export class OrganizationNotFoundException extends HttpException {
  constructor(id: string) {
    super('Not found!', HttpStatus.NOT_FOUND, {
      cause: new Error(`Organization with id (${id}) not found!`),
    });
  }
}
