import { Inject, Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { DateTime } from 'luxon';
import { GMAIL_PROVIDER, HTTP_PROVIDER } from '../../../../core/constants';
import { BadRequestException, NotFoundException } from '../../../../core/exceptions';
import { GmailService, Mail, PayTabsConfigs, PayTabsService, SenderType } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';
import { ORGANIZATION_SERVICE_PROVIDER } from '../../../organization/domain';
import { OrganizationService } from '../../../organization/infrastructure';
import { PaymentEntityType } from '../../../payment/domain';
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

    @Inject(GMAIL_PROVIDER)
    private readonly gmailService: GmailService,

    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: OrganizationService,
  ) {}

  async getSubscription(id: string): Promise<Subscription> {
    return this.subscriptionRepo.get(id);
  }

  async getSubscriptions(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Subscription[]> {
    return this.subscriptionRepo.getMany(filters, page, limit, order);
  }

  async addSubscription(subscription: Partial<Subscription> & { organizationId: string; planId: string }): Promise<Subscription> {
    return this.subscriptionRepo.add(subscription);
  }

  async updateSubscription(subscription: Partial<Subscription> & { id: string }): Promise<Subscription> {
    return this.subscriptionRepo.update(subscription);
  }

  async startFreeTrial(organizationId: string): Promise<Subscription> {
    const FREE_TRIAL_PLAN_ID = 'oF8dIBzzHsOoM7aPm0E0'; // FREE PLAN ID

    // Get the default/free plan
    const freePlan = await this.planService.getPlan(FREE_TRIAL_PLAN_ID); // FREE PLAN ID
    // console.log('freePlan', freePlan);
    if (!freePlan) {
      throw new NotFoundException('Free plan not found');
    }

    const now = DateTime.now().toMillis();
    const trialEndDate = DateTime.now().plus({ days: 14 }).toMillis(); // 14-day trial

    const savedSubscription = await this.addSubscription({
      organizationId,
      planId: freePlan.id,

      status: SubscriptionStatus.TRIAL,

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
    const updatedSubscription = await this.updateSubscription({
      id: savedSubscription.id,
      usage: newUsage,
    });

    return updatedSubscription;
  }

  async changeSubscriptionPlan(subscription: Partial<Subscription> & { organizationId: string; planId: string }): Promise<any> {
    const gatewayResponse = {
      status: 200,
      message: 'success',
      url: '',
    };

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
      const customMetaData = JSON.stringify([`type:${PaymentEntityType.SUBSCRIPTION}`, `subscriptionId:${subscription.id}`, `planId:${subscription.planId}`]);

      const plan = await this.planService.getPlan(subscription.planId);
      const totalAmount = plan.price; //TODO: ADD COUPON DISCOUNT IF AVAILABLE

      const organization = await this.organizationService.getOrganization(subscription.organizationId);

      const hostedPage = await billing.createHostedPaymentPage(subscription.id, organization, plan, totalAmount, customMetaData);
      console.log('hostedPage', hostedPage);

      gatewayResponse.url = hostedPage.redirect_url;
    } catch (error) {
      console.log('error', error);
    }

    return gatewayResponse;
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    const credentials: PayTabsConfigs = {
      profileId: +process.env.PAYTABS_PROFILE_ID,
      serverKey: process.env.PAYTABS_SERVER_KEY,
    };

    const subscription = await this.getSubscription(id);
    if (subscription.status === SubscriptionStatus.CANCELED) {
      throw new BadRequestException('The subscription has already been canceled!');
    }

    const billing = new PayTabsService(credentials, this.http);

    const cancelAgreements = await billing.cancelAgreement(subscription.gatewaySubscriptionId);
    console.log('cancelAgreements', cancelAgreements);

    if (cancelAgreements.status === 'success') {
      const updatedSubscription = await this.subscriptionRepo.update({
        id,
        status: SubscriptionStatus.CANCELED,
        endAt: Date.now(),
      });

      const organization = await this.organizationService.getOrganization(updatedSubscription.organizationId);

      const organizationMail: Mail = {
        recipient: organization.email,
        replyTo: process.env.GMAIL_AUTH_USER,
        senderName: 'Mofawtar Support',
        subject: `Your subscription has been canceled successfully`,
        body: 'Hello, your subscription has been canceled successfully. Please contact us if you have any questions.',
        senderType: SenderType.SUPPORT,
      };

      // Send notification email
      this.gmailService.addJob(organizationMail);

      const adminMail: Mail = {
        recipient: process.env.GMAIL_AUTH_USER,
        replyTo: process.env.GMAIL_AUTH_USER,
        senderName: 'Mofawtar Subscription Service',
        subject: `${organization.name} has canceled their subscription`,
        body: 'Hello Admin, the organization has canceled their subscription. Organization email: ' + organization.email,
        senderType: SenderType.SUPPORT,
      };

      // Send notification email
      this.gmailService.addJob(adminMail);

      return updatedSubscription;
    } else {
      //TODO: HOW TO HANDLE CANCEL AGREEMENT ERROR
      // throw new BadRequestException('Failed to cancel the subscription agreement');
    }
  }
}
