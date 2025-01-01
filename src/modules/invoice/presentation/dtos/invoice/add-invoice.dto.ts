import { OmitType } from '@nestjs/swagger';

import { InvoiceDto } from './invoice.dto';

export class AddInvoiceDto extends OmitType(InvoiceDto, ['id', 'status', 'paymentStatus', 'type', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {
  issue?: boolean;
}
