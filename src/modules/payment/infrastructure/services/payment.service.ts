import { Inject, Injectable } from '@nestjs/common';

import { EASY_KASH_PROVIDER, PAY_TABS_PROVIDER, PAYPAL_PROVIDER, STRIPE_PROVIDER } from '../../../../core/constants';
import { PaymentGateway } from '../../../../core/enums';
import { BadRequestException } from '../../../../core/exceptions';
import { Currency, Receiver } from '../../../../core/models';
import { EasyKashService, PaypalService, PayTabsService, StripeService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { IInvoiceService, INVOICE_SERVICE_PROVIDER } from '../../../invoice/domain';
import {
  BILLING_ACCOUNT_SERVICE_PROVIDER,
  BillingAccount,
  IBillingAccountService,
  IOrganizationService,
  ORGANIZATION_SERVICE_PROVIDER,
} from '../../../organization/domain';
import { IReceiptService, RECEIPT_SERVICE_PROVIDER } from '../../../receipt/domain';

import { IPaymentRepository, IPaymentService, Payment, PAYMENT_REPOSITORY_PROVIDER, PaymentEntity, PaymentEntityType, PaymentMethod } from '../../domain';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
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

    // Parse the credentials
    const credentials = BillingAccount.toCredentials(billingAccount.credentials);

    // Fetch the payment entity (invoice, receipt, etc.) and validate it
    const entities: PaymentEntity[] = await Promise.all(payment.entityIds.map(id => this.getPaymentEntity(payment.entityType, id)));
    const receiver: Receiver = entities[0].receiver;

    // Accumulate the total amount of the payment
    const totalAmount = entities.reduce((total, { totalAmount }) => total + totalAmount, 0);
    const currency: Currency = entities[0].currency;

    if (!entities.length) {
      throw new BadRequestException('No entities found for the provided payment!');
    }

    // Check if all payment receivers are the same
    if (entities.every(({ clientId }) => clientId == entities[0].clientId)) {
      throw new BadRequestException('All payment receivers must be the same!');
    }

    // Create new payment with processing status
    const newPayment = await this.repo.add(payment);

    switch (payment.gateway) {
      case PaymentGateway.STRIPE: {
        try {
          // Payment gateway for the client (invoice receiver)
          const billing = new StripeService({ apiKey: credentials.apiKey });

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
            payment.entityType == PaymentEntityType.INVOICE
              ? { mofawtarInvoices: entities.map(({ id }) => id).join(', '), type: PaymentEntityType.INVOICE, paymentId: newPayment.id }
              : { mofawtarReceipts: entities.map(({ id }) => id).join(', '), type: PaymentEntityType.RECEIPT, paymentId: newPayment.id },
          );

          const invoiceItem = await billing.addInvoiceItem(
            customer.id,
            invoice.id,
            price.id,
            1,
            `Created By Mofawtar: Invoice item for ${customer.name}`,
            currency.code,
          );

          await billing.finalizeInvoice(invoice.id);
        } catch {
          throw new BadRequestException('Failed to process the payment!');
        }
      }

      case PaymentGateway.PAYPAL: {
      }

      case PaymentGateway.EASYKASH: {
      }

      case PaymentGateway.PAYTABS: {
        // Payment gateway for the client (invoice receiver)
        const billing = new PayTabsService({
          serverKey: credentials.serverKey,
          profileId: credentials.profileId,
        });

        const invoice = await billing.addInvoice({
          id: entities.map(({ id }) => id).join(', '), // TODO: CHANGE IF THE PAYMENT CAN NOT BE REACHABLE
          amount: totalAmount,
          currency: currency.code,
          clientName: receiver.name,
        });
      }

      default: {
        throw new BadRequestException(`The provided gateway "${payment.gateway}" is not supported!`);
      }
    }
  }

  async updatePayment(payments: Partial<Payment> & { id: string }): Promise<Payment> {
    return this.repo.update(payments);
  }

  async deletePayment(id: string): Promise<Payment> {
    return this.repo.delete(id);
  }
}
