import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { BadRequestException } from '../../../../../core/exceptions';
import { IInvoiceService, Invoice, INVOICE_SERVICE_PROVIDER, InvoiceStatus } from '../../../domain';

@Injectable()
export class DeleteInvoice implements Usecase<Invoice> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(id: string): Promise<Invoice> {
    return this.invoiceService.getInvoice(id).then(async invoice => {
      if ([InvoiceStatus.PAID, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.REFUNDED].includes(invoice.status)) {
        throw new BadRequestException('Invoice cannot be deleted due payment applied!');
      }

      return this.invoiceService.deleteInvoice(id);
    });
  }
}
