import { Inject, Injectable } from '@nestjs/common';

import { google as GoogleProtos } from '@google-cloud/tasks/build/protos/protos';

import { DateTime } from 'luxon';
import { CLOUD_TASKS_PROVIDER, GMAIL_PROVIDER } from '../../../../core/constants';
import { CloudTasksService, GmailService, Mail, SenderType } from '../../../../core/providers';
import { Utils } from '../../../../core/utils';
import { ORGANIZATION_SERVICE_PROVIDER } from '../../../organization/domain';
import { OrganizationService } from '../../../organization/infrastructure';
import {
  ISubscriptionPlanService,
  ISubscriptionService,
  Subscription,
  SUBSCRIPTION_PLAN_SERVICE_PROVIDER,
  SUBSCRIPTION_SERVICE_PROVIDER,
  SubscriptionStatus,
} from '../../domain';

@Injectable()
export class SubscriptionCronManager {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,

    @Inject(SUBSCRIPTION_PLAN_SERVICE_PROVIDER)
    private readonly planService: ISubscriptionPlanService,

    @Inject(CLOUD_TASKS_PROVIDER)
    private readonly cloudTasksService: CloudTasksService,

    @Inject(GMAIL_PROVIDER)
    private readonly gmailService: GmailService,

    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: OrganizationService,
  ) {}

  // CALLED FROM TASK QUEUE
  async handlerSubscriptionExpiry(subscription: Subscription): Promise<void> {
    // console.log('data', data);

    // TODO: SHOULD I DELETE USAGE DATA AND ADD THEM TO LOGS?
    await this.subscriptionService.updateSubscription({
      id: subscription.id,
      status: SubscriptionStatus.EXPIRED,
    });

    const organization = await this.organizationService.getOrganization(subscription.organizationId);

    const mail: Mail = {
      recipient: organization.email,
      replyTo: process.env.GMAIL_AUTH_USER,
      senderName: 'Mofawtar Support',
      subject: `Your subscription has Expired`,
      body: 'Hello, your subscription has expired. Please renew your subscription to regain full access.',
      senderType: SenderType.SUPPORT,
    };

    // Send notification email
    this.gmailService.addJob(mail);
    console.log(`✅ Processed expired subscription for ${organization.email}`);
    // return { success: true, message: 'Subscription expired and user notified' };
    return;
  }

  async setExpirySubscriptionData(): Promise<void> {
    // const startOfNextDay = DateTime.now().startOf('day').plus({ days: 1 }).toMillis(); // 1744799783510
    const currentTime = DateTime.now().toMillis(); // 1744799783510

    const subscriptions = await this.subscriptionService.getSubscriptions([
      {
        key: 'status',
        operator: 'in',
        value: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELED],
      },
      {
        key: 'endAt',
        operator: 'lt',
        value: currentTime,
      },
    ]);

    for (const subscription of subscriptions) {
      const payload = JSON.stringify(subscription);

      const task: GoogleProtos.cloud.tasks.v2.ITask = {
        name: this.cloudTasksService.getTaskName('expired-subscriptions', Utils.Generators.complexNumericId()),
        httpRequest: {
          body: Buffer.from(payload).toString('base64'),
          headers: { 'Content-Type': 'application/json' },
          httpMethod: 'POST',
          // url: 'https://us-east1-mofawtar-backend.cloudfunctions.net/publishEinvoiceToSign', //PROD
          url: `${process.env.PROD_URL}/webhooks/subscriptions/handle-expire`, // DEV
        },
      };

      const isQueueExists = await this.cloudTasksService.getQueue('expired-subscriptions');

      if (!isQueueExists) {
        await this.cloudTasksService.createQueue('expired-subscriptions');
      }

      console.log('isQueueExists', isQueueExists);

      const isTaskAdded = await this.cloudTasksService.addTask('expired-subscriptions', task);
      console.log('addTask', isTaskAdded);
    }

    console.log('subscriptions length', subscriptions.length);
  }
}
