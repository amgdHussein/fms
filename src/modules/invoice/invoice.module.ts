import { Module } from '@nestjs/common';

import {
  AddInvoice,
  DeleteInvoice,
  GetClientInvoices,
  GetInvoice,
  GetInvoiceItems,
  GetOrganizationInvoices,
  IsInvoiceExistConstraint,
  QueryInvoices,
  UpdateInvoice,
} from './application';
import { INVOICE_REPOSITORY_PROVIDER, INVOICE_SERVICE_PROVIDER, INVOICE_USECASE_PROVIDERS } from './domain';
import { InvoiceFirestoreRepository, InvoiceService } from './infrastructure';
import { InvoiceController } from './presentation';

const validators = [IsInvoiceExistConstraint];
const invoiceUsecases = [
  {
    provide: INVOICE_USECASE_PROVIDERS.GET_INVOICE,
    useClass: GetInvoice,
  },
  {
    provide: INVOICE_USECASE_PROVIDERS.GET_INVOICE_ITEMS,
    useClass: GetInvoiceItems,
  },
  {
    provide: INVOICE_USECASE_PROVIDERS.ADD_INVOICE,
    useClass: AddInvoice,
  },
  {
    provide: INVOICE_USECASE_PROVIDERS.UPDATE_INVOICE,
    useClass: UpdateInvoice,
  },
  {
    provide: INVOICE_USECASE_PROVIDERS.DELETE_INVOICE,
    useClass: DeleteInvoice,
  },
  {
    provide: INVOICE_USECASE_PROVIDERS.QUERY_INVOICES,
    useClass: QueryInvoices,
  },
  {
    provide: INVOICE_USECASE_PROVIDERS.GET_CLIENT_INVOICES,
    useClass: GetClientInvoices,
  },
  {
    provide: INVOICE_USECASE_PROVIDERS.GET_ORGANIZATION_INVOICES,
    useClass: GetOrganizationInvoices,
  },
];

@Module({
  imports: [],
  controllers: [InvoiceController],
  providers: [
    ...validators,
    {
      provide: INVOICE_REPOSITORY_PROVIDER,
      useClass: InvoiceFirestoreRepository,
    },
    {
      provide: INVOICE_SERVICE_PROVIDER,
      useClass: InvoiceService,
    },
    ...invoiceUsecases,
  ],
  exports: [
    {
      provide: INVOICE_SERVICE_PROVIDER,
      useClass: InvoiceService,
    },
  ],
})
export class InvoiceModule {}
