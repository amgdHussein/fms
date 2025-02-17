import { OmitType, PartialType } from '@nestjs/swagger';

import { BillingAccountDto } from './billing-account.dto';

export class UpdateBillingAccountDto extends PartialType(
  OmitType(BillingAccountDto, ['id', 'organizationId', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']),
) {}
