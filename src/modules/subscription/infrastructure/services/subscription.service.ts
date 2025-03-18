import { Inject, Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { DateTime } from 'luxon';
import { HTTP_PROVIDER, PAY_TABS_PROVIDER } from '../../../../core/constants';
import { PaymentGateway } from '../../../../core/enums';
import { BadRequestException, NotFoundException } from '../../../../core/exceptions';
import { PayTabsConfigs, PayTabsService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';
import { PaymentEntityType, PaymentMethod } from '../../../payment/domain';
import {
  ISubscriptionRepository,
  ISubscriptionService,
  Subscription,
  SUBSCRIPTION_PLAN_SERVICE_PROVIDER,
  SUBSCRIPTION_REPOSITORY_PROVIDER,
  SUBSCRIPTION_USAGE_SERVICE_PROVIDER,
  SubscriptionStatus,
  Usage,
  UsageType,
} from '../../domain';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionUsageService } from './subscription-usage.service';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(HTTP_PROVIDER)
    private readonly http: HttpService,

    @Inject(SUBSCRIPTION_REPOSITORY_PROVIDER)
    private readonly subscriptionRepo: ISubscriptionRepository,

    @Inject(SUBSCRIPTION_PLAN_SERVICE_PROVIDER)
    private readonly planService: SubscriptionPlanService,

    @Inject(SUBSCRIPTION_USAGE_SERVICE_PROVIDER)
    private readonly usageService: SubscriptionUsageService,

    @Inject(PAY_TABS_PROVIDER)
    private readonly paytabsService: PayTabsService,
  ) {}

  async getSubscription(id: string): Promise<Subscription> {
    return this.subscriptionRepo.get(id);
  }

  async getSubscriptions(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Subscription[]> {
    return this.subscriptionRepo.getMany(filters, page, limit, order);
  }

  async addSubscription(subscription: Partial<Subscription> & { organizationId: string; planId: string }): Promise<Subscription> {
    // subscription.status = SubscriptionStatus.PENDING;

    // if (!subscription.autoRenew) {
    //   subscription.autoRenew = false;
    // }

    console.log('subscription', subscription);

    return await this.createSubscription(subscription);

    return this.subscriptionRepo.add(subscription);
  }

  async updateSubscription(subscription: Partial<Subscription> & { id: string }): Promise<Subscription> {
    return this.subscriptionRepo.update(subscription);
  }

  async activateSubscription(id: string): Promise<Subscription> {
    return this.subscriptionRepo.update({
      id,
      status: SubscriptionStatus.ACTIVE,
      //TODO: ADD START AT ??
    });
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return this.subscriptionRepo.update({
      id,
      status: SubscriptionStatus.CANCELED,
      endAt: Date.now(),
    });
  }

  async startFreeTrial(organizationId: string): Promise<Subscription> {
    // Check if user already has an active subscription
    // const existingSubscription = await this.getSubscriptions([
    //   { key: 'organizationId', operator: 'eq', value: organizationId },
    //   { key: 'status', operator: 'eq', value: SubscriptionStatus.ACTIVE },
    //   { key: 'status', operator: 'eq', value: SubscriptionStatus.TRIAL },
    // ]);

    // if (existingSubscription) {
    //   throw new BadRequestException('User already has an active subscription or trial');
    // }

    // Get the default/free plan
    const freePlan = await this.planService.getPlan('oF8dIBzzHsOoM7aPm0E0'); // FREE PLAN ID
    console.log('freePlan', freePlan);

    if (!freePlan) {
      throw new NotFoundException('Free plan not found');
    }

    const now = DateTime.now().toMillis();
    const trialEndDate = DateTime.now().plus({ days: 15 }).toMillis(); // 15-day trial

    //TODO: CALL addSubscription FUNCTION ??
    const savedSubscription = await this.subscriptionRepo.add({
      organizationId,
      planId: freePlan.id,

      status: SubscriptionStatus.TRIAL,
      autoRenew: false,

      startAt: now,
      endAt: trialEndDate,
    });

    const usages: Partial<Usage>[] = [
      {
        organizationId,
        subscriptionId: savedSubscription.id,

        type: UsageType.MEMBERS,
        used: 0,
        remaining: freePlan.maxMembers,
        limit: freePlan.maxMembers,
      },
      {
        organizationId,
        subscriptionId: savedSubscription.id,

        type: UsageType.CLIENTS,
        used: 0,
        remaining: freePlan.maxClients,
        limit: freePlan.maxClients,
      },
      {
        organizationId,
        subscriptionId: savedSubscription.id,

        type: UsageType.SUBMISSIONS,
        used: 0,
        remaining: freePlan.maxSubmissions,
        limit: freePlan.maxSubmissions,
      },
      {
        organizationId,
        subscriptionId: savedSubscription.id,

        type: UsageType.BRANCHES,
        used: 0,
        remaining: freePlan.maxBranches,
        limit: freePlan.maxBranches,
      },
    ];

    const newUsage = await this.usageService.addUsage(usages, savedSubscription.id);

    // update subscription with usage
    const updatedSubscription = await this.subscriptionRepo.update({
      id: savedSubscription.id,
      usage: newUsage,
    });

    return updatedSubscription;
  }

  // async createSubscription(userId: string, plan: string, billingCycle: string) {
  async createSubscription(subscription: Partial<Subscription> & { organizationId: string; planId: string }): Promise<any> {
    let response = null;

    switch (subscription.paymentMethod) {
      case PaymentMethod.CREDIT_CARD: {
        response = await this.processSubscriptionGatewayPayment(subscription);
        break;
      }

      case PaymentMethod.CASH: {
        // return this.processCashPayment(payment);
        break;
      }

      case PaymentMethod.CHECK: {
        // return this.processCheckPayment(payment);
        break;
      }

      case PaymentMethod.BANK_TRANSFER: {
        // return this.processBankTransferPayment(payment);
        break;
      }

      default: {
        throw new BadRequestException('Invalid payment method!');
      }
    }

    console.log('response', response);

    return response;
  }

  private async processSubscriptionGatewayPayment(subscription: Partial<Subscription>): Promise<any> {
    // console.log('subscription', subscription);
    // return;
    let gatewayResponse = {
      status: 200,
      message: 'success',
      url: '',
    };

    // Fetch the billing account for the organization and validate it
    // const [billingAccount] = await this.billingAccountService.getBillingAccounts(
    //   payment.organizationId,
    //   [{ key: 'gateway', operator: 'eq', value: payment.gateway }],
    //   1,
    //   1,
    // );

    // if (!billingAccount) {
    //   throw new BadRequestException(`No billing account found in the organization for the provided gateway "${payment.gateway}"!`);
    // }

    // // Fetch the payment entity (invoice, receipt, etc.) and validate it
    // const entities: PaymentEntity[] = await Promise.all(payment.entityIds.map(async id => this.getPaymentEntity(payment.entityType, id)));
    // const receiver: Receiver = entities[0].receiver;

    // // Accumulate the total amount of the payment
    // const totalAmount = entities.reduce((total, { totalAmount }) => total + totalAmount, 0);
    // const currency: Currency = entities[0].currency;

    // if (!entities.length) {
    //   throw new BadRequestException('No entities found for the provided payment!');
    // }

    // // Check if all payment receivers are the same
    // if (!entities.every(({ clientId }) => clientId == payment.clientId)) {
    //   throw new BadRequestException('All payment receivers must be the same!');
    // }

    //TODO: ADD THIS
    // if (this.selectionSelected.some(invoice => invoice.status === InvoiceStatus.PAID)) {
    //   this.notification.showError(
    //     'One or more of the selected invoices have already been paid. Please select unpaid invoices',
    //   );
    //   return;
    // }

    // Create new payment with processing status
    // const newPayment = await this.repo.add(payment);

    // const userRef = this.firebaseService.getDocument('users', userId);
    // const userSnapshot = await userRef.get();
    // if (!userSnapshot.exists) {
    //   throw new Error('User not found');
    // }

    // const amount = this.getPlanPrice(plan, billingCycle);
    // const paymentUrl = await this.payTabsService.createPayment(userSnapshot.data(), plan, billingCycle, amount);

    // return { paymentUrl };

    switch (subscription.paymentGateway) {
      case PaymentGateway.STRIPE: {
        console.log('stripe case maybe add in the feature :)');
        break;
      }

      case PaymentGateway.PAYTABS: {
        console.log('PAYTABS case');
        // return newPayment;

        try {
          // Payment gateway for the client (invoice receiver)
          const credentials: PayTabsConfigs = {
            profileId: +process.env.PAYTABS_PROFILE_ID,
            serverKey: process.env.PAYTABS_SERVER_KEY,
          };

          console.log('credentials', credentials);

          const billing = new PayTabsService(credentials, this.http);

          //TODO: ADD PLAN, AMOUNT, COUPON TO METADATA

          const customMetaData = JSON.stringify([
            `type:${PaymentEntityType.SUBSCRIPTION}`,
            `subscriptionId:${subscription.id}`,
            `planId:${subscription.planId}`,
          ]);

          const getPlan = await this.planService.getPlan(subscription.planId);
          const totalAmount = getPlan.price;

          const hostedPage = await billing.createHostedPaymentPage(subscription.id, totalAmount, customMetaData);

          gatewayResponse.url = hostedPage.redirect_url;

          // hostedPage {
          //   tran_ref: 'TST2507102033213',
          //   tran_type: 'Sale',
          //   cart_id: 'hOabKAKvlYutzcdeWa1F',
          //   cart_description: 'Subscription for Mofawtar',
          //   cart_currency: 'EGP',
          //   cart_amount: '300.00',
          //   tran_total: '0',
          //   callback: 'https://frank-chicken-quietly.ngrok-free.app/webhooks/payments/paytabs',
          //   return: 'http://localhost:4200/success',
          //   redirect_url: 'https://secure-egypt.paytabs.com/payment/wr/5D222F5582E41ABE3E74C715A4EEE69933AEF4F151486544741ABC2A',
          //   serviceId: 2,
          //   paymentChannel: 'Payment Page',
          //   profileId: 140150,
          //   merchantId: 79780,
          //   trace: 'PMNT0401.67D1EA4C.00008A2A'
          // }

          console.log('hostedPage', hostedPage);

          break;
        } catch (error) {
          console.log('error', error);
        }
      }

      default: {
        throw new BadRequestException(`The provided subscription gateway "${subscription.paymentGateway}" is not supported!`);
      }
    }

    return gatewayResponse;
  }

  // async processWebhook(body) {
  //   const paymentDetails = await this.payTabsService.verifyPayment(body.payment_reference);
  //   if (paymentDetails.response_code === "100") {
  //     const subscriptionRef = this.firebaseService.getDocument('subscriptions', paymentDetails.reference_no);
  //     await subscriptionRef.update({
  //       status: 'active',
  //       subscriptionEndsAt: new Date(new Date().setMonth(new Date().getMonth() + 1))
  //     });

  //     const userRef = this.firebaseService.getDocument('users', paymentDetails.customer_email);
  //     await userRef.update({ subscriptionStatus: 'active' });
  //   } else {
  //     throw new Error('Payment verification failed');
  //   }
  // }

  // async getSubscriptionStatus(userId: string) {
  //   const subscriptionRef = this.firebaseService.getDocument('subscriptions', userId);
  //   const subscriptionSnapshot = await subscriptionRef.get();
  //   return subscriptionSnapshot.exists ? subscriptionSnapshot.data() : null;
  // }

  // private getPlanPrice(plan, billingCycle) {
  //   const pricing = {
  //     basic: { monthly: 10, yearly: 100 },
  //     pro: { monthly: 20, yearly: 200 },
  //     business: { monthly: 50, yearly: 500 },
  //     enterprise: { monthly: 100, yearly: 1000 },
  //   };
  //   return pricing[plan][billingCycle];
  // }
}
