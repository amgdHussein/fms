import { Inject, Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

import { EASY_KASH_PROVIDER, ENCRYPTION_PROVIDER, HTTP_PROVIDER, PAY_TABS_PROVIDER, PAYPAL_PROVIDER, STRIPE_PROVIDER } from '../../../../core/constants';
import { PaymentGateway } from '../../../../core/enums';
import { BadRequestException } from '../../../../core/exceptions';
import { Currency, Receiver } from '../../../../core/models';
import { EasyKashService, EncryptionService, PaypalService, PayTabsConfigs, PayTabsService, StripeConfigs, StripeService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { IInvoiceService, INVOICE_SERVICE_PROVIDER } from '../../../invoice/domain';
import { BILLING_ACCOUNT_SERVICE_PROVIDER, IBillingAccountService, IOrganizationService, ORGANIZATION_SERVICE_PROVIDER } from '../../../organization/domain';
import { IReceiptService, RECEIPT_SERVICE_PROVIDER } from '../../../receipt/domain';

import { IPaymentRepository, IPaymentService, Payment, PAYMENT_REPOSITORY_PROVIDER, PaymentEntity, PaymentEntityType, PaymentMethod } from '../../domain';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @Inject(HTTP_PROVIDER)
    private readonly http: HttpService,

    @Inject(ENCRYPTION_PROVIDER)
    private encryptionService: EncryptionService,

    @Inject(STRIPE_PROVIDER)
    private readonly stripeService: StripeService,

    @Inject(PAY_TABS_PROVIDER)
    private readonly paytabsService: PayTabsService,

    @Inject(EASY_KASH_PROVIDER)
    private readonly easyKashService: EasyKashService,

    @Inject(PAYPAL_PROVIDER)
    private readonly paypalService: PaypalService,

    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly repo: IPaymentRepository,

    @Inject(BILLING_ACCOUNT_SERVICE_PROVIDER)
    private readonly billingAccountService: IBillingAccountService,

    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,

    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: IOrganizationService,

    @Inject(RECEIPT_SERVICE_PROVIDER)
    private readonly receiptService: IReceiptService,
  ) {}

  async getPayment(id: string): Promise<Payment> {
    return this.repo.get(id);
  }

  async getPayments(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Payment[]> {
    return this.repo.getMany(filters, page, limit, order);
  }

  async addPayment(payment: Partial<Payment>): Promise<Payment> {
    switch (payment.method) {
      case PaymentMethod.CREDIT_CARD: {
        return this.processGatewayPayment(payment);
        break;
      }

      case PaymentMethod.CASH: {
        return this.processCashPayment(payment);
      }

      case PaymentMethod.CHECK: {
        return this.processCheckPayment(payment);
      }

      case PaymentMethod.BANK_TRANSFER: {
        return this.processBankTransferPayment(payment);
      }

      default: {
        throw new BadRequestException('Invalid payment method!');
      }
    }
  }

  private async getPaymentEntity(entity: PaymentEntityType, id: string): Promise<PaymentEntity> {
    switch (entity) {
      case PaymentEntityType.INVOICE: {
        return this.invoiceService.getInvoice(id);
      }

      case PaymentEntityType.RECEIPT: {
        return this.receiptService.getReceipt(id);
      }

      default: {
        throw new BadRequestException('Invalid payment entity!');
      }
    }
  }

  private async processCashPayment(payment: Partial<Payment>): Promise<Payment> {
    throw new BadRequestException('Cash payments are not supported yet');
  }

  private async processCheckPayment(payment: Partial<Payment>): Promise<Payment> {
    throw new BadRequestException('Check payments are not supported yet');
  }

  private async processBankTransferPayment(payment: Partial<Payment>): Promise<Payment> {
    throw new BadRequestException('Bank transfer payments are not supported yet');
  }

  private async processGatewayPayment(payment: Partial<Payment>): Promise<Payment> {
    // Fetch the billing account for the organization and validate it
    const [billingAccount] = await this.billingAccountService.getBillingAccounts(
      payment.organizationId,
      [{ key: 'gateway', operator: 'eq', value: payment.gateway }],
      1,
      1,
    );

    if (!billingAccount) {
      throw new BadRequestException(`No billing account found in the organization for the provided gateway "${payment.gateway}"!`);
    }

    // Fetch the payment entity (invoice, receipt, etc.) and validate it
    const entities: PaymentEntity[] = await Promise.all(payment.entityIds.map(async id => this.getPaymentEntity(payment.entityType, id)));
    const receiver: Receiver = entities[0].receiver;

    // Accumulate the total amount of the payment
    const totalAmount = entities.reduce((total, { totalAmount }) => total + totalAmount, 0);
    const currency: Currency = entities[0].currency;

    if (!entities.length) {
      throw new BadRequestException('No entities found for the provided payment!');
    }

    // Check if all payment receivers are the same
    if (!entities.every(({ clientId }) => clientId == payment.clientId)) {
      throw new BadRequestException('All payment receivers must be the same!');
    }

    //TODO: ADD THIS
    // if (this.selectionSelected.some(invoice => invoice.status === InvoiceStatus.PAID)) {
    //   this.notification.showError(
    //     'One or more of the selected invoices have already been paid. Please select unpaid invoices',
    //   );
    //   return;
    // }

    // Create new payment with processing status
    const newPayment = await this.repo.add(payment);

    switch (payment.gateway) {
      case PaymentGateway.STRIPE: {
        console.log('stripe case');

        try {
          // Payment gateway for the client (invoice receiver)
          const credentials = await this.encryptionService.decrypt<StripeConfigs>(billingAccount.credentials);
          const billing = new StripeService(credentials);

          //TODO: THINK OF CHECKOUT INSTEAD OF INVOICE

          // Payment Customer for the client (invoice receiver)
          let [customer] = await billing.queryCustomers(`email:"${receiver.email}"`, 1);

          if (!customer) {
            customer = await billing.addCustomer(
              receiver.name,
              receiver.email,
              receiver.phone && receiver.phone.value ? `${receiver.phone.code}${receiver.phone.value}` : null,
              {
                city: receiver.address.city,
                country: receiver.address.country,
                line1: receiver.address.street,
                postal_code: receiver.address.postalCode,
                state: receiver.address.governorate,
              },
              {
                preferred_currency: currency.code.toLowerCase(),
              },
            );
          }

          const product = await billing.addProduct(
            `Created By Mofawtar: Invoice for ${customer.name}`,
            'service',
            // `Created By Mofawtar: Invoice for ${customer.name}`,
          );

          const price = await billing.addPrice(product.id, totalAmount, currency.code);

          const invoice = await billing.addInvoice(
            customer.id,
            `Created By Mofawtar: Invoice for ${customer.name}`,
            currency.code,
            'send_invoice',
            //TODO Can be changed
            { payment_method_types: ['card'] },
            true,
            30, //TODO Can be changed

            {
              mofawtarEntityIds: entities.map(({ id }) => id).join(', '),
              type: payment.entityType == PaymentEntityType.INVOICE ? PaymentEntityType.INVOICE : PaymentEntityType.RECEIPT,
              paymentId: newPayment.id,
            },
          );

          const invoiceItem = await billing.addInvoiceItem(
            customer.id,
            invoice.id,
            price.id,
            1,
            `Created By Mofawtar: Invoices numbers #${payment.entityNumbers.join(', ')} for ${customer.name}`,
            currency.code,
          );

          const test = await billing.finalizeInvoice(invoice.id);
          console.log('finalizeInvoice', test);
        } catch {
          throw new BadRequestException('Failed to process the payment!');
        }

        return newPayment; //TODO: I MUST RETURN URL TO REDIRECT TO IF CREDIT CARD

        break;
      }

      case PaymentGateway.PAYPAL: {
        console.log('paypal case');
      }

      case PaymentGateway.EASYKASH: {
        console.log('easyKAash case');
      }

      case PaymentGateway.PAYTABS: {
        console.log('PAYTABS case');
        // return newPayment;

        // Payment gateway for the client (invoice receiver)
        const credentials = await this.encryptionService.decrypt<PayTabsConfigs>(billingAccount.credentials);
        const billing = new PayTabsService(credentials, this.http);

        //TODO: CHECK THIS WITH WHAT'S INSIDE  ADD INVOICE FUNCTION IN PAYTABS
        const customMetaData = JSON.stringify([
          `mofawtarEntityIds:${entities.map(({ id }) => id).join(', ')}`,
          `type:${payment.entityType}`,
          `paymentId:${newPayment.id}`,
        ]);

        const invoice = await billing.addInvoice({
          id: entities.map(({ id }) => id).join(', '), // TODO: CHANGE IF THE PAYMENT CAN NOT BE REACHABLE
          amount: totalAmount,
          currency: currency.code,
          clientName: receiver.name,
          metadata: customMetaData,
          // {
          //   mofawtarEntityIds: entities.map(({ id }) => id).join(', '),
          //   type: payment.entityType,
          //   paymentId: newPayment.id,
          // },
        });

        console.log('invoice from paytabs', invoice);

        // TEST GET TRANSACTION

        // const res = await billing.queryTransactionByTranRef();
        // console.log('res', JSON.stringify(res));

        //TODO: I MUST RETURN URL TO REDIRECT TO IF CREDIT CARD

        break;
      }

      default: {
        throw new BadRequestException(`The provided gateway "${payment.gateway}" is not supported!`);
      }
    }
  }

  async updatePayment(payments: Partial<Payment> & { id: string }): Promise<Payment> {
    return this.repo.update(payments);
  }

  async deletePayment(id: string): Promise<any> {
    const billing = new StripeService({
      apiKey: 'sk_test_51QYrNYKNln1hF56rD6elusvFk152uoMjIiHE5iY0Dw9U49tF3ECzuck4n2q7rTep0ufyj7OadfVFBKidtrtNGA9100o852DIKn',
    });

    //TODO: HOW AND WHEN TO ADD WEBHOOK AND KNOW IFU ADD ALREADY OR NOT
    const test = await billing.addWebhookEndpoint('payments/handler/stripe', ['invoice.payment_succeeded', 'invoice.payment_failed']);

    // {
    //   "id": "we_1QzMt6KNln1hF56ruSQIqivd",
    //   "object": "webhook_endpoint",
    //   "api_version": null,
    //   "application": null,
    //   "created": 1741200108,
    //   "description": null,
    //   "enabled_events": [
    //     "invoice.payment_succeeded",
    //     "invoice.payment_failed"
    //   ],
    //   "livemode": false,
    //   "metadata": {},
    //   "secret": "whsec_napE22q6fW3Yc24fiHTVBKbQ7WHElgRj",
    //   "status": "enabled",
    //   "url": "https://frank-chicken-quietly.ngrok-free.app/payments/handler/stripe"
    // }

    return test;
    // return this.repo.delete(id);
  }
}
