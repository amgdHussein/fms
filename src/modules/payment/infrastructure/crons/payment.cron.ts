import { Inject, Injectable, Logger } from '@nestjs/common';

import Stripe from 'stripe';

import { PaymentResponseStatus, PayTabsPaymentResponse } from '../../../../core/providers/paytabs/entities';

import { DateTime } from 'luxon';

import { IInvoiceService, INVOICE_SERVICE_PROVIDER, InvoiceStatus } from '../../../invoice/domain';
import { IReceiptService, RECEIPT_SERVICE_PROVIDER, ReceiptStatus } from '../../../receipt/domain';
import { ISubscriptionService, SUBSCRIPTION_SERVICE_PROVIDER, SubscriptionStatus } from '../../../subscription/domain';
import { IPaymentService, PAYMENT_SERVICE_PROVIDER, PaymentEntityType, PaymentStatus } from '../../domain';

@Injectable()
export class PaymentCronManager {
  private readonly logger: Logger = new Logger(PaymentCronManager.name);

  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,

    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,

    @Inject(RECEIPT_SERVICE_PROVIDER)
    private readonly receiptService: IReceiptService,

    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,
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

    const metaData = JSON.parse(event.user_defined.udf1); // udf1: ['mofawtarEntityIds: pAgEwXQvAHL8I2MiTxZk', 'type: 0', 'paymentId: 6BISUaXdKJHE3dPRBuly']

    const entityIds: string[] = metaData.at(0).split(':').at(1).trim().split(', ');
    const entityType = metaData.at(1).split(':').at(1).trim() as unknown as PaymentEntityType;
    const paymentId: string = metaData.at(2).split(':').at(1).trim();

    const referenceId = event.tran_ref;
    const processedAt = DateTime.fromISO(event.payment_result.transaction_time).toMillis();
    const status = getPaymentStatus(paymentStatus);

    await this.handlePaymentWebhook(paymentId, status, entityIds, entityType, referenceId, processedAt);
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
}
