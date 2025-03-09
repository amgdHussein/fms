import { OmitType, PartialType } from '@nestjs/swagger';

import { InvoiceDto } from './invoice.dto';

export class UpdateInvoiceDto extends PartialType(
  OmitType(InvoiceDto, ['id', 'organizationId', 'status', 'type', 'direction', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']),
) {}
