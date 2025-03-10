import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SubscriptionCronManager } from '../../infrastructure';

// TODO: HIDE THE CONTROLLER FORM THE API DOCUMENTATION
@ApiTags('Crons')
@Controller('crons')
export class SubscriptionHandler {
  constructor(private readonly subscriptionManger: SubscriptionCronManager) {}

  @Get('subscriptions')
  async handlerSubscriptionExpiry(): Promise<void> {
    return this.subscriptionManger.handlerSubscriptionExpiry();
  }
}
