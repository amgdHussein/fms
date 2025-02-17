import { OmitType } from '@nestjs/swagger';

import { BillingAccountDto } from './billing-account.dto';

export class AddBillingAccountDto extends OmitType(BillingAccountDto, ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}
