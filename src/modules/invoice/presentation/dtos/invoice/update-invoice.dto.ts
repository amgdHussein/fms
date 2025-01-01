import { OmitType, PartialType } from '@nestjs/swagger';

import { InvoiceDto } from './invoice.dto';

export class UpdateInvoiceDto extends PartialType(
  OmitType(InvoiceDto, ['id', 'organizationId', 'status', 'paymentStatus', 'type', 'direction', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']),
) {}
