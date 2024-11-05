import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IInvoiceService, Invoice, INVOICE_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class AddInvoice implements Usecase<Invoice> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(invoice: Partial<Invoice> & { systemId: string; issue: boolean }): Promise<Invoice> {
    return this.invoiceService.addInvoice(invoice).then(invoice => {
      // TODO: SEND EMAIL TO CLIENT IF ISSUE IS TRUE
      return invoice;
    });
  }
}
