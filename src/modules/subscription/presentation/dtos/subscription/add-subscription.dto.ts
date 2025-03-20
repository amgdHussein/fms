import { PickType } from '@nestjs/swagger';

import { SubscriptionDto } from './subscription.dto';

export class AddSubscriptionDto extends PickType(SubscriptionDto, ['planId', 'organizationId']) {}
