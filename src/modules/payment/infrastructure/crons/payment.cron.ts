import { Inject, Injectable, Logger } from '@nestjs/common';

import Stripe from 'stripe';

import { PaymentResponseStatus, PayTabsPaymentResponse } from '../../../../core/providers/paytabs/entities';

import { DateTime } from 'luxon';

import { CountryCode, CurrencyCode, Cycle, PaymentGateway } from '../../../../core/enums';
import { IInvoiceService, INVOICE_SERVICE_PROVIDER, InvoiceDirection, InvoiceForm, InvoiceStatus, InvoiceType } from '../../../invoice/domain';
import { Organization, ORGANIZATION_SERVICE_PROVIDER } from '../../../organization/domain';
import { OrganizationService } from '../../../organization/infrastructure';
import { IReceiptService, RECEIPT_SERVICE_PROVIDER, ReceiptStatus } from '../../../receipt/domain';
import {
  ISubscriptionPlanService,
  ISubscriptionService,
  Plan,
  Subscription,
  SUBSCRIPTION_PLAN_SERVICE_PROVIDER,
  SUBSCRIPTION_SERVICE_PROVIDER,
  SUBSCRIPTION_USAGE_SERVICE_PROVIDER,
  SubscriptionInvoice,
  SubscriptionStatus,
  Usage,
  UsageType,
} from '../../../subscription/domain';
import { SubscriptionUsageService } from '../../../subscription/infrastructure';
import {
  IPaymentRepository,
  IPaymentService,
  PAYMENT_REPOSITORY_PROVIDER,
  PAYMENT_SERVICE_PROVIDER,
  PaymentEntityType,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from '../../domain';

@Injectable()
export class PaymentCronManager {
  private readonly logger: Logger = new Logger(PaymentCronManager.name);

  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,

    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepo: IPaymentRepository,

    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,

    @Inject(RECEIPT_SERVICE_PROVIDER)
    private readonly receiptService: IReceiptService,

    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,

    @Inject(SUBSCRIPTION_PLAN_SERVICE_PROVIDER)
    private readonly planService: ISubscriptionPlanService,

    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: OrganizationService,

    @Inject(SUBSCRIPTION_USAGE_SERVICE_PROVIDER)
    private readonly usageService: SubscriptionUsageService,
  ) {}

  async handlePaytabsWebhook(event: PayTabsPaymentResponse): Promise<void> {
    const getPaymentStatus = (status: PaymentResponseStatus): PaymentStatus => {
      switch (status) {
        case PaymentResponseStatus.AUTHORIZED: {
          return PaymentStatus.COMPLETED;
        }

        //TODO: TEST THIS CASES
        case PaymentResponseStatus.DECLINED:
        case PaymentResponseStatus.ERROR: {
          return PaymentStatus.FAILED;
        }

        default: {
          return PaymentStatus.PROCESSING;
        }
      }
    };

    const paymentStatus = event?.payment_result?.response_status;

    const invoiceAndReceiptsMetaData = event.user_defined.udf1 ? JSON.parse(event.user_defined.udf1) : ''; // udf1: ['mofawtarEntityIds: pAgEwXQvAHL8I2MiTxZk', 'type: 0', 'paymentId: 6BISUaXdKJHE3dPRBuly']
    const subscriptionMetaData = event.user_defined.udf2 ? JSON.parse(event.user_defined.udf2) : ''; // udf1: ['mofawtarEntityIds: pAgEwXQvAHL8I2MiTxZk', 'type: 0', 'paymentId: 6BISUaXdKJHE3dPRBuly']

    const referenceId = event.tran_ref;
    const processedAt = DateTime.fromISO(event.payment_result.transaction_time).toMillis();
    const status = getPaymentStatus(paymentStatus);

    if (invoiceAndReceiptsMetaData.length) {
      console.log('if', invoiceAndReceiptsMetaData);

      const entityIds: string[] = invoiceAndReceiptsMetaData.at(0).split(':').at(1).trim().split(', ');
      const entityType = invoiceAndReceiptsMetaData.at(1).split(':').at(1).trim() as unknown as PaymentEntityType;
      const paymentId: string = invoiceAndReceiptsMetaData.at(2).split(':').at(1).trim();

      console.log('collected', entityType, entityIds, paymentId);

      // await this.handlePaymentWebhook(paymentId, status, entityIds, entityType, referenceId, processedAt);
    } else {
      // subscriptionMetaData
      console.log('else', subscriptionMetaData);
      const entityType = Number(subscriptionMetaData.at(0).split(':').at(1).trim()) as PaymentEntityType;
      const subscriptionId: string = subscriptionMetaData.at(1).split(':').at(1).trim();
      const planId: string = subscriptionMetaData.at(2).split(':').at(1).trim();
      const paymentTotal = +event?.tran_total;
      const paymentCurrency = event?.tran_currency; // TODO: CHECK WITH cart_currency
      const gatewaySubscriptionId = event.agreement_id;

      console.log('collected', entityType, subscriptionId, paymentTotal, paymentCurrency);

      //TODO: THINK OF THIS LOGIC
      if (entityType !== PaymentEntityType.SUBSCRIPTION) {
        this.logger.error(`Invalid entity type: ${entityType}, ${PaymentEntityType.SUBSCRIPTION}`); //TODO: CEHCK THIS error
        return;
      }

      await this.handleSubscriptionWebhook(
        status,
        PaymentEntityType.SUBSCRIPTION,
        subscriptionId,
        planId,
        paymentTotal,
        paymentCurrency,
        referenceId,
        processedAt,
        gatewaySubscriptionId,
      );
    }
  }

  async handleStripeWebhook(event: Stripe.EventBase): Promise<void> {
    const getPaymentStatus = (status: string): PaymentStatus => {
      switch (status) {
        case 'invoice.payment_succeeded': {
          return PaymentStatus.COMPLETED;
        }

        case 'invoice.payment_failed': {
          return PaymentStatus.FAILED;
        }

        default: {
          return PaymentStatus.PROCESSING;
        }
      }
    };

    const paymentStatus = event.type;

    const entityIds: string[] = event.data.object['metadata']['mofawtarEntityIds'].split(', ');
    const entityType: PaymentEntityType = event.data.object['metadata']['type'];
    const paymentId: string = event.data.object['metadata']['paymentId'];

    const referenceId: string = event.data.object['payment_intent'];
    const processedAt: number = event.data.object['webhooks_delivered_at'];
    const status = getPaymentStatus(paymentStatus);

    return await this.handlePaymentWebhook(paymentId, status, entityIds, entityType, referenceId, processedAt);
  }

  private async handlePaymentWebhook(
    paymentId: string,
    status: PaymentStatus,
    entityIds: string[],
    entityType: PaymentEntityType,
    referenceId: string,
    processedAt: number,
  ): Promise<void> {
    console.log('handlePaymentWebhook', paymentId, status, entityIds, entityType);
    //TODO:ADD LOGS IF ANY ERROR HAPPENS

    switch (status) {
      case PaymentStatus.COMPLETED: {
        // Update the invoices/receipts status
        for (const id of entityIds) {
          await this.updateSuccessfulPaymentEntity(entityType, id, paymentId, processedAt);
        }

        await this.paymentService.updatePayment({
          id: paymentId,
          status: PaymentStatus.COMPLETED,
          referenceId: referenceId, // Reference ID from the payment gateway
          processedAt: processedAt,
          paidAt: processedAt,
        });

        break;
      }

      case PaymentStatus.FAILED: {
        await this.paymentService.updatePayment({
          id: paymentId,
          status: PaymentStatus.FAILED,
        });

        break;
      }

      default: {
        this.logger.warn(`Unhandled payment status: ${status}`);
        break;
      }
    }

    return;
  }

  private async updateSuccessfulPaymentEntity(entityType: PaymentEntityType, entityId: string, paymentId: string, processedAt: number): Promise<void> {
    switch (entityType) {
      case PaymentEntityType.INVOICE: {
        const invoice = await this.invoiceService.updateInvoice({
          id: entityId,
          paymentId,
          status: InvoiceStatus.PAID,
        });

        break;
      }

      case PaymentEntityType.RECEIPT: {
        await this.receiptService.updateReceipt({
          id: entityId,
          paymentId,
          status: ReceiptStatus.PAID,
        });

        break;
      }

      case PaymentEntityType.SUBSCRIPTION: {
        const invoice = await this.invoiceService.updateInvoice({
          id: entityId,
          paymentId,
          status: InvoiceStatus.PAID,
        });

        await this.subscriptionService.updateSubscription({
          id: (invoice as any).subscriptionId, // TODO: Fix this
          status: SubscriptionStatus.ACTIVE,
          startAt: Date.now(),
          billingAt: processedAt,
        });

        break;
      }

      default: {
        this.logger.warn(`Unhandled payment entity type: ${entityType}`);
        break;
      }
    }
  }

  private async handleSubscriptionWebhook(
    status: PaymentStatus,
    entityType: PaymentEntityType.SUBSCRIPTION,
    subscriptionId: string,
    planId: string,
    paymentTotal: number,
    currency: CurrencyCode,
    referenceId: string,
    processedAt: number,
    gatewaySubscriptionId: number,
  ): Promise<void> {
    console.log('handleSubscriptionWebhook', status, subscriptionId, entityType);
    //TODO:ADD LOGS IF ANY ERROR HAPPENS
    const subscription = await this.subscriptionService.getSubscription(subscriptionId);
    const organization = await this.organizationService.getOrganization(subscription.organizationId);

    switch (status) {
      case PaymentStatus.COMPLETED: {
        // TODO: SHOULD I COMPARE THE AMOUNT FROM PAYTABS WITH THE AMOUNT FROM THE SUBSCRIPTION ??
        // const subscription = await this.subscriptionService.getSubscription(subscriptionId);
        // const amountFromPaytabs = paymentTotal;

        const payment = await this.paymentRepo.add({
          status: PaymentStatus.COMPLETED,
          referenceId: referenceId, // Reference ID from the payment gateway
          processedAt: processedAt,
          paidAt: processedAt,

          organizationId: 'mofawtar', //TODO: WHAT TO ADD HERE ??
          clientId: organization.id,
          clientName: organization.name,

          entityType: PaymentEntityType.SUBSCRIPTION,
          entityIds: [subscriptionId],
          entityNumbers: [subscriptionId],

          type: PaymentType.INCOME,
          amount: paymentTotal,
          currency: {
            code: currency,
            rate: 1, // TODO: HOW TO HANDLE FOREIGN CURRENCIES
          },

          method: PaymentMethod.CREDIT_CARD,
          gateway: PaymentGateway.PAYTABS,
        });

        // Update the invoices/receipts status
        await this.createSuccessfulPaymentEntity(subscription, planId, payment.id, processedAt, currency, paymentTotal, organization, gatewaySubscriptionId);

        break;
      }

      case PaymentStatus.FAILED: {
        // TODO: Handle failed subscription payment
        // await this.paymentService.updatePayment({
        //   id: paymentId,
        //   status: PaymentStatus.FAILED,
        // });

        break;
      }

      default: {
        this.logger.warn(`Unhandled payment status: ${status}`);
        break;
      }
    }

    return;
  }

  private async createSuccessfulPaymentEntity(
    subscription: Subscription,
    planId: string,
    paymentId: string,
    processedAt: number,
    currency: CurrencyCode,
    totalAmount: number,
    organization: Organization,
    gatewaySubscriptionId: number,
  ): Promise<void> {
    const plan = await this.planService.getPlan(planId);

    const usages: Partial<Usage>[] = [
      {
        organizationId: organization.id,
        subscriptionId: subscription.id,

        type: UsageType.MEMBERS,
        used: 0,
        remaining: plan.maxMembers,
        limit: plan.maxMembers,
      },
      {
        organizationId: organization.id,
        subscriptionId: subscription.id,

        type: UsageType.CLIENTS,
        used: 0,
        remaining: plan.maxClients,
        limit: plan.maxClients,
      },
      {
        organizationId: organization.id,
        subscriptionId: subscription.id,

        type: UsageType.SUBMISSIONS,
        used: 0,
        remaining: plan.maxSubmissions,
        limit: plan.maxSubmissions,
      },
      {
        organizationId: organization.id,
        subscriptionId: subscription.id,

        type: UsageType.BRANCHES,
        used: 0,
        remaining: plan.maxBranches,
        limit: plan.maxBranches,
      },
    ];

    const newUsage = await this.usageService.addUsage(usages, subscription.id);

    // update subscription with usage
    await this.subscriptionService.updateSubscription({
      id: subscription.id,
      status: SubscriptionStatus.ACTIVE,
      planId: plan.id,
      startAt: Date.now(),
      endAt: this.getEndAtForPlan(plan), // TODO: HOW TO HANDLE THE END DATE
      gatewaySubscriptionId: gatewaySubscriptionId,
      billingAt: processedAt,
      usage: newUsage,
    });

    const invoice = await this.invoiceService.addInvoice(this.createSubscriptionInvoice(subscription.id, currency, paymentId, totalAmount, organization, plan));
    console.log('final invoice', invoice);
  }

  private getEndAtForPlan(plan: Plan): number {
    const cycle = plan.cycle;
    const period = cycle === Cycle.MONTHLY ? { months: 1 } : { years: 1 };

    return DateTime.now().plus(period).toMillis();
  }

  private createSubscriptionInvoice(
    subscriptionId: string,
    currency: string,
    paymentId: string,
    totalAmount: number,
    organization: Organization,
    plan: Plan,
  ): Partial<SubscriptionInvoice> & {
    organizationId: string;
  } {
    return {
      id: '',
      organizationId: 'mofawtar', //TODO: WHAT TO ADD HERE ??
      clientId: organization.id, //TODO FILL THIS

      issuer: {
        name: 'Mofawtar',
        address: {
          //TODO: THINK OF ADD STATIC OR IN ENV
          street: '8013 street 9, apt no. 6',
          city: 'Cairo',
          country: CountryCode.EGYPT,
          governorate: 'Mokattam',
        },
        email: process.env.GMAIL_AUTH_USER, //TODO: THINK OF THIS
      },
      receiver: {
        name: organization.name,
        address: organization.address,
      },

      invoiceNumber: this.complexNumericId(), // Next incrementing number for the invoice (organization specific)

      subscriptionId: subscriptionId,

      type: InvoiceType.STANDARD,
      form: InvoiceForm.INVOICE,
      direction: InvoiceDirection.SENT,

      currency: {
        code: currency as CurrencyCode,
        rate: 1, //TODO: HOW TO HANDLE FOREIGN CURRENCIES
      },

      status: InvoiceStatus.PAID, // Status of the invoice
      paymentId: paymentId,

      discount: 0, // TODO: ADD DISCOUNTS IF ANY
      additionalDiscount: 0, // TODO: ADD DISCOUNTS IF ANY

      grossAmount: totalAmount,
      netAmount: totalAmount,
      paidAmount: totalAmount,
      totalAmount: totalAmount,

      items: [
        {
          id: '',
          organizationId: 'mofawtar', // Unique ID for the organization
          profileId: '', // Unique ID for the client profile
          clientId: organization.id, // Unique ID for the client
          invoiceId: '', // Unique ID for the invoice
          productId: '', // Unique ID for the organization product
          codeId: '', // Unique ID for the tax code

          name: `${plan.name} Plan`, // Name of the product
          category: 'Subscription Plan', // Category of the product (UI for filtering products)

          unitPrice: totalAmount, // Price per unit of the product
          unitType: 'EA', // each
          quantity: 1, // Quantity of the item

          grossAmount: totalAmount, // ? amount // The total cost of all products before taxes and discounts
          netAmount: totalAmount, // ? netTotal // The total cost after discounts but before taxes
          totalAmount: totalAmount, // The total cost after discounts and taxes

          createdBy: '',
          createdAt: 0,
          updatedBy: '',
          updatedAt: 0,
        },
      ],

      issuedAt: Date.now(), // Timestamp when the invoice was issued
      dueAt: Date.now(), // Timestamp when the invoice is due
      // logo: Photo, // TODO: ADD MOFAWTAR LINK FOR Logo

      createdBy: '',
      createdAt: 0,
      updatedBy: '',
      updatedAt: 0,
    };
  }

  /**
   * Generates a complex numeric ID consisting of random digits.
   *
   * @param {number} [length=12] - The length of the ID. Defaults to 12.
   * @return {string} The generated ID.
   */
  complexNumericId(length = 12): string {
    // Create an array to hold the ID digits
    const digits: number[] = [];

    // Generate cryptographically strong random values
    // from 0 to 9 for each digit
    for (let i = 0; i < length; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    // Shuffle the array to randomize the digits
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = digits[i];
      digits[i] = digits[j];
      digits[j] = temp;
    }

    // Join the array into a string
    return digits.join('');
  }
}
