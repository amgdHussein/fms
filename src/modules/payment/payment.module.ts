import { Module } from '@nestjs/common';

import { AuthModule } from '../../core/auth';

import { INVOICE_ITEM_REPOSITORY_PROVIDER, INVOICE_REPOSITORY_PROVIDER, INVOICE_SERVICE_PROVIDER } from '../invoice/domain';
import { InvoiceFirestoreRepository, InvoiceItemFirestoreRepository, InvoiceService } from '../invoice/infrastructure';

import {
  SUBSCRIPTION_PLAN_REPOSITORY_PROVIDER,
  SUBSCRIPTION_PLAN_SERVICE_PROVIDER,
  SUBSCRIPTION_REPOSITORY_PROVIDER,
  SUBSCRIPTION_SERVICE_PROVIDER,
  SUBSCRIPTION_USAGE_REPOSITORY_PROVIDER,
  SUBSCRIPTION_USAGE_SERVICE_PROVIDER,
} from '../subscription/domain';
import {
  SubscriptionFirestoreRepository,
  SubscriptionPlanFirestoreRepository,
  SubscriptionPlanService,
  SubscriptionService,
  SubscriptionUsageFirestoreRepository,
  SubscriptionUsageService,
} from '../subscription/infrastructure';
import { AddPayment, DeletePayment, GetPayment, GetPayments, UpdatePayment } from './application';
import { PAYMENT_REPOSITORY_PROVIDER, PAYMENT_SERVICE_PROVIDER, PAYMENT_USECASE_PROVIDERS } from './domain';
import { PaymentCronManager, PaymentFirestoreRepository, PaymentService } from './infrastructure';
import { PaymentController, PaymentHandler } from './presentation';

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

@Module({
  imports: [AuthModule],
  controllers: [PaymentController, PaymentHandler],
  providers: [
    PaymentCronManager,

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

    {
      provide: SUBSCRIPTION_REPOSITORY_PROVIDER,
      useClass: SubscriptionFirestoreRepository,
    },

    {
      provide: SUBSCRIPTION_SERVICE_PROVIDER,
      useClass: SubscriptionService,
    },

    {
      provide: SUBSCRIPTION_PLAN_REPOSITORY_PROVIDER,
      useClass: SubscriptionPlanFirestoreRepository,
    },

    {
      provide: SUBSCRIPTION_PLAN_SERVICE_PROVIDER,
      useClass: SubscriptionPlanService,
    },

    {
      provide: SUBSCRIPTION_USAGE_REPOSITORY_PROVIDER,
      useClass: SubscriptionUsageFirestoreRepository,
    },
    {
      provide: SUBSCRIPTION_USAGE_SERVICE_PROVIDER,
      useClass: SubscriptionUsageService,
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
