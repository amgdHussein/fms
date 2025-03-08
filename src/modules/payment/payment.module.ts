import { Module } from '@nestjs/common';

import { AuthModule } from '../../core/auth';

import { INVOICE_ITEM_REPOSITORY_PROVIDER, INVOICE_REPOSITORY_PROVIDER, INVOICE_SERVICE_PROVIDER } from '../invoice/domain';
import { InvoiceFirestoreRepository, InvoiceItemFirestoreRepository, InvoiceService } from '../invoice/infrastructure';

import { AddPayment, DeletePayment, GetPayment, GetPayments, UpdatePayment } from './application';
import { PAYMENT_REPOSITORY_PROVIDER, PAYMENT_SERVICE_PROVIDER, PAYMENT_USECASE_PROVIDERS } from './domain';
import { PaymentFirestoreRepository, PaymentHandler, PaymentService } from './infrastructure';

import { PaymentController, PaymentHandlerController } from './presentation';

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
    provide: PAYMENT_USECASE_PROVIDERS.UPDATE_PAYMENT,
    useClass: UpdatePayment,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.GET_PAYMENTS,
    useClass: GetPayments,
  },
  {
    provide: PAYMENT_USECASE_PROVIDERS.DELETE_PAYMENT,
    useClass: DeletePayment,
  },
];

const handlers = [PaymentHandler];

@Module({
  imports: [AuthModule],
  controllers: [PaymentController, PaymentHandlerController],
  providers: [
    ...paymentUsecases,
    ...handlers,
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
