import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Subscription } from '../../domain';
import { SubscriptionCronManager } from '../../infrastructure';

// TODO: HIDE THE CONTROLLER FORM THE API DOCUMENTATION
@ApiTags('Webhooks')
@Controller('webhooks')
export class SubscriptionHandler {
  constructor(private readonly subscriptionManger: SubscriptionCronManager) {}

  // @Cron('0 0 * * *') // Runs every day at midnight
  @Get('subscriptions/set-expire')
  setExpirySubscriptionData(): void {
    this.subscriptionManger.setExpirySubscriptionData();
    return;
  }

  @Post('subscriptions/handle-expire') // TODO: FIX THIS IN SERVICE
  async handlerSubscriptionExpiry(@Body() data: Subscription): Promise<void> {
    return this.subscriptionManger.handlerSubscriptionExpiry(data);
  }
}
