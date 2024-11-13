import { HttpException, HttpStatus } from '@nestjs/common';

export class SubscriptionExpiredException extends HttpException {
  constructor(subscriptionId: string) {
    super('Bad Request', HttpStatus.BAD_REQUEST, {
      cause: new Error(`Subscription with ID ${subscriptionId} has expired.`),
    });
  }
}
