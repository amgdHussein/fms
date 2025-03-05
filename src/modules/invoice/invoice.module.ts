import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import {
  AcceptEtaInvoice,
  AddInvoice,
  CancelEtaInvoice,
  DeleteInvoice,
  GetClientInvoices,
  GetInvoice,
  GetInvoiceItems,
  GetInvoices,
  GetOrganizationInvoices,
  IsInvoiceExistConstraint,
  ProcessEtaInvoices,
  SubmitEtaInvoices,
  SyncReceivedInvoices,
  UpdateInvoice,
} from './application';
import {
  ETA_EINVOICING_QUEUE_PROVIDER,
  ETA_INVOICE_PROCESSOR_PROVIDER,
  ETA_INVOICE_SERVICE_PROVIDER,
  ETA_INVOICE_USECASE_PROVIDERS,
  INVOICE_ITEM_REPOSITORY_PROVIDER,
  INVOICE_REPOSITORY_PROVIDER,
  INVOICE_SERVICE_PROVIDER,
  INVOICE_SUBMISSION_REPOSITORY_PROVIDER,
  INVOICE_USECASE_PROVIDERS,
} from './domain';
import {
  EtaInvoiceService,
  EtaInvoicingProcessor,
  InvoiceFirestoreRepository,
  InvoiceItemFirestoreRepository,
  InvoiceService,
  InvoiceSubmissionFirestoreRepository,
} from './infrastructure';
import { EtaInvoiceController, InvoiceController } from './presentation';

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
    provide: INVOICE_USECASE_PROVIDERS.GET_INVOICES,
    useClass: GetInvoices,
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

const etaInvoiceUsecases = [
  // ? Invoice Specific Usecases
  {
    provide: ETA_INVOICE_USECASE_PROVIDERS.SUBMIT_INVOICES,
    useClass: SubmitEtaInvoices,
  },
  {
    provide: ETA_INVOICE_USECASE_PROVIDERS.CANCEL_INVOICE,
    useClass: CancelEtaInvoice,
  },
  {
    provide: ETA_INVOICE_USECASE_PROVIDERS.PROCESS_INVOICE,
    useClass: ProcessEtaInvoices,
  },
  {
    provide: ETA_INVOICE_USECASE_PROVIDERS.ACCEPT_INVOICE,
    useClass: AcceptEtaInvoice,
  },
  {
    provide: ETA_INVOICE_USECASE_PROVIDERS.SYNC_RECEIVED_INVOICES,
    useClass: SyncReceivedInvoices,
  },
];

@Module({
  imports: [BullModule.registerQueue({ name: ETA_EINVOICING_QUEUE_PROVIDER })],
  controllers: [InvoiceController, EtaInvoiceController],
  providers: [
    ...validators,
    {
      provide: INVOICE_SUBMISSION_REPOSITORY_PROVIDER,
      useClass: InvoiceSubmissionFirestoreRepository,
    },
    {
      provide: INVOICE_ITEM_REPOSITORY_PROVIDER,
      useClass: InvoiceItemFirestoreRepository,
    },
    {
      provide: INVOICE_REPOSITORY_PROVIDER,
      useClass: InvoiceFirestoreRepository,
    },
    {
      provide: INVOICE_SERVICE_PROVIDER,
      useClass: InvoiceService,
    },

    {
      provide: ETA_INVOICE_SERVICE_PROVIDER,
      useClass: EtaInvoiceService,
    },
    {
      provide: ETA_INVOICE_PROCESSOR_PROVIDER,
      useClass: EtaInvoicingProcessor,
    },

    ...invoiceUsecases,
    ...etaInvoiceUsecases,
  ],
  exports: [
    {
      provide: INVOICE_SERVICE_PROVIDER,
      useClass: InvoiceService,
    },
    {
      provide: ETA_INVOICE_SERVICE_PROVIDER,
      useClass: EtaInvoiceService,
    },
  ],
})
export class InvoiceModule {}
