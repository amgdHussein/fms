import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { InvoiceDto } from './invoice.dto';

export class UpdateInvoiceDto extends IntersectionType(
  PickType(InvoiceDto, ['id']),
  PartialType(OmitType(InvoiceDto, ['id', 'systemId', 'status', 'paymentStatus', 'type', 'direction', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
) {}
