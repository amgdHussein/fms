import { HttpException, HttpStatus } from '@nestjs/common';

export class OrganizationInactiveException extends HttpException {
  constructor(name: string) {
    super('Bad Request', HttpStatus.BAD_REQUEST, {
      cause: new Error(`Organization (${name}) is not active!`),
    });
  }
}
