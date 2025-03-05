import { Inject, Injectable, Logger } from '@nestjs/common';

import Stripe from 'stripe';

import { PaymentResponseStatus, PayTabsPaymentResponse } from '../../../../core/providers/paytabs/entities';

import { IInvoiceService, INVOICE_SERVICE_PROVIDER, InvoiceStatus } from '../../../invoice/domain';
import { IReceiptService, RECEIPT_SERVICE_PROVIDER, ReceiptStatus } from '../../../receipt/domain';
import { IPaymentService, PAYMENT_SERVICE_PROVIDER, PaymentEntityType, PaymentStatus } from '../../domain';

@Injectable()
export class PaymentHandler {
  private readonly logger: Logger = new Logger(PaymentHandler.name);

  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,

    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,

    @Inject(RECEIPT_SERVICE_PROVIDER)
    private readonly receiptService: IReceiptService,
  ) {}

  async handlePaytabsWebhook(event: PayTabsPaymentResponse): Promise<void> {
    const getPaymentStatus = (status: PaymentResponseStatus): PaymentStatus => {
      switch (status) {
        case PaymentResponseStatus.AUTHORIZED: {
          return PaymentStatus.COMPLETED;
        }

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

    const entityIds: string[] = event.cart_id.split(', ');
    const paymentId: string = ''; // TODO: HANDLE GETTING PAYMENT ID FROM PAYMENT RESPONSE
    const entityType: PaymentEntityType = PaymentEntityType.INVOICE; // TODO: HANDLE GETTING ENTITY TYPE FROM PAYMENT RESPONSE
    const status = getPaymentStatus(paymentStatus);

    await this.handlePaymentWebhook(paymentId, status, entityIds, entityType);
  }

  async handleStripeWebhook(event: Stripe.Event): Promise<void> {
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

    // TODO: REVISE THE METADATA RETRIEVING
    const entityIds: string[] = event.data.object['metadata']['mofawtarInvoices'].split(', ');
    const entityType: PaymentEntityType = event.data.object['metadata']['type'];
    const paymentId: string = event.data.object['paymentId'];
    const status = getPaymentStatus(paymentStatus);

    await this.handlePaymentWebhook(paymentId, status, entityIds, entityType);
  }

  private async handlePaymentWebhook(paymentId: string, status: PaymentStatus, entityIds: string[], entityType: PaymentEntityType): Promise<void> {
    switch (status) {
      case PaymentStatus.COMPLETED: {
        // Update the invoices/receipts status
        for (const id of entityIds) {
          if (entityType == PaymentEntityType.INVOICE) {
            await this.invoiceService.updateInvoice({
              id: id,
              status: InvoiceStatus.PAID,
            });
          } else {
            await this.receiptService.updateReceipt({
              id: id,
              status: ReceiptStatus.PAID,
            });
          }
        }

        await this.paymentService.updatePayment({
          id: paymentId,
          status: PaymentStatus.COMPLETED,
        });

        return;
      }

      case PaymentStatus.FAILED: {
        await this.paymentService.updatePayment({
          id: paymentId,
          status: PaymentStatus.FAILED,
        });

        return;
      }

      default: {
        this.logger.warn(`Unhandled payment status: ${status}`);
        return;
      }
    }
  }
}
