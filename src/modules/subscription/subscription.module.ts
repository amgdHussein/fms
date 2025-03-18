import { Module } from '@nestjs/common';

import { INVOICE_ITEM_REPOSITORY_PROVIDER, INVOICE_REPOSITORY_PROVIDER, INVOICE_SERVICE_PROVIDER } from '../invoice/domain';
import { InvoiceFirestoreRepository, InvoiceItemFirestoreRepository, InvoiceService } from '../invoice/infrastructure';
import {
  AddPlan,
  AddSubscription,
  CancelSubscription,
  GetOrganizationSubscription,
  GetPlan,
  GetPlans,
  GetSubscription,
  StartFreeTrialSubscription,
  UpdatePlan,
} from './application';
import {
  SUBSCRIPTION_PLAN_REPOSITORY_PROVIDER,
  SUBSCRIPTION_PLAN_SERVICE_PROVIDER,
  SUBSCRIPTION_PLAN_USECASE_PROVIDERS,
  SUBSCRIPTION_REPOSITORY_PROVIDER,
  SUBSCRIPTION_SERVICE_PROVIDER,
  SUBSCRIPTION_USAGE_REPOSITORY_PROVIDER,
  SUBSCRIPTION_USAGE_SERVICE_PROVIDER,
  SUBSCRIPTION_USECASE_PROVIDERS,
} from './domain';
import {
  SubscriptionCronManager,
  SubscriptionFirestoreRepository,
  SubscriptionPlanFirestoreRepository,
  SubscriptionPlanService,
  SubscriptionService,
  SubscriptionUsageFirestoreRepository,
  SubscriptionUsageService,
} from './infrastructure';
import { SubscriptionController, SubscriptionHandler, SubscriptionPlanController } from './presentation';

const subscriptionUsecases = [
  {
    provide: SUBSCRIPTION_USECASE_PROVIDERS.ADD_SUBSCRIPTION,
    useClass: AddSubscription,
  },
  {
    provide: SUBSCRIPTION_USECASE_PROVIDERS.GET_SUBSCRIPTION,
    useClass: GetSubscription,
  },
  {
    provide: SUBSCRIPTION_USECASE_PROVIDERS.GET_ORGANIZATION_SUBSCRIPTION,
    useClass: GetOrganizationSubscription,
  },
  {
    provide: SUBSCRIPTION_USECASE_PROVIDERS.CANCELED_SUBSCRIPTION,
    useClass: CancelSubscription,
  },
  {
    provide: SUBSCRIPTION_USECASE_PROVIDERS.START_FREE_TRIAL_SUBSCRIPTION,
    useClass: StartFreeTrialSubscription,
  },
];
const subscriptionPlanUsecases = [
  {
    provide: SUBSCRIPTION_PLAN_USECASE_PROVIDERS.ADD_SUBSCRIPTION_PLAN,
    useClass: AddPlan,
  },
  {
    provide: SUBSCRIPTION_PLAN_USECASE_PROVIDERS.UPDATE_SUBSCRIPTION_PLAN,
    useClass: UpdatePlan,
  },
  {
    provide: SUBSCRIPTION_PLAN_USECASE_PROVIDERS.GET_SUBSCRIPTION_PLANS,
    useClass: GetPlans,
  },
  {
    provide: SUBSCRIPTION_PLAN_USECASE_PROVIDERS.GET_SUBSCRIPTION_PLAN,
    useClass: GetPlan,
  },
];

@Module({
  controllers: [SubscriptionController, SubscriptionPlanController, SubscriptionHandler],
  providers: [
    SubscriptionCronManager,

    ...subscriptionUsecases,
    ...subscriptionPlanUsecases,
    {
      provide: SUBSCRIPTION_REPOSITORY_PROVIDER,
      useClass: SubscriptionFirestoreRepository,
    },
    {
      provide: SUBSCRIPTION_SERVICE_PROVIDER,
      useClass: SubscriptionService,
    },
    {
      provide: SUBSCRIPTION_USAGE_REPOSITORY_PROVIDER,
      useClass: SubscriptionUsageFirestoreRepository,
    },
    {
      provide: SUBSCRIPTION_USAGE_SERVICE_PROVIDER,
      useClass: SubscriptionUsageService,
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
      provide: SUBSCRIPTION_SERVICE_PROVIDER,
      useClass: SubscriptionService,
    },
    {
      provide: SUBSCRIPTION_PLAN_SERVICE_PROVIDER,
      useClass: SubscriptionPlanService,
    },
  ],
})
export class SubscriptionModule {}
