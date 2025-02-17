import { Module } from '@nestjs/common';
import { AuthModule } from '../../core/auth';
import { INVOICE_ITEM_REPOSITORY_PROVIDER, INVOICE_REPOSITORY_PROVIDER, INVOICE_SERVICE_PROVIDER } from '../invoice/domain';
import { InvoiceFirestoreRepository, InvoiceItemFirestoreRepository, InvoiceService } from '../invoice/infrastructure';
import {
  AddPayment,
  AddPayments,
  CreatePaytabsInvoice,
  CreateStripeInvoice,
  CreateWebhookEndpoint,
  DeletePayment,
  GetPayment,
  HandleStripeWebhook,
  PaytabsCallback,
  QueryPayments,
  RetrieveBalance,
  UpdatePayment,
  UpdateStripeApiKey,
} from './application';
import { PAYMENT_REPOSITORY_PROVIDER, PAYMENT_SERVICE_PROVIDER, PAYMENT_USECASE_PROVIDERS } from './domain';
import { PaymentFirestoreRepository, PaymentService } from './infrastructure';
import { PaymentController } from './presentation';

const paymentUsecases = [
  {
    provide: PAYMENT_USECASE_PROVIDERS.GET_PAYMENT,
    useClass: GetPayment,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.ADD_PAYMENT,
    useClass: AddPayment,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.ADD_PAYMENTS,
    useClass: AddPayments,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.UPDATE_PAYMENT,
    useClass: UpdatePayment,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.QUERY_PAYMENTS,
    useClass: QueryPayments,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.DELETE_PAYMENT,
    useClass: DeletePayment,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.CREATE_STRIPE_INVOICE,
    useClass: CreateStripeInvoice,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.CREATE_WEBHOOK_ENDPOINT,
    useClass: CreateWebhookEndpoint,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.HANDLE_STRIPE_WEBHOOK,
    useClass: HandleStripeWebhook,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.UPDATE_STRIPE_API_KEY,
    useClass: UpdateStripeApiKey,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.CREATE_PAYTABS_INVOICE,
    useClass: CreatePaytabsInvoice,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.PAYTABS_CALLBACK,
    useClass: PaytabsCallback,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.RETRIEVE_STRIPE_BALANCE,
    useClass: RetrieveBalance,
  },
];

@Module({
  imports: [AuthModule],
  controllers: [PaymentController],
  providers: [
    ...paymentUsecases,
    {
      provide: PAYMENT_REPOSITORY_PROVIDER,
      useClass: PaymentFirestoreRepository,
    },
    {
      provide: PAYMENT_SERVICE_PROVIDER,
      useClass: PaymentService,
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
  ],
  exports: [
    {
      provide: PAYMENT_SERVICE_PROVIDER,
      useClass: PaymentService,
    },
  ],
})
export class PaymentModule {}
