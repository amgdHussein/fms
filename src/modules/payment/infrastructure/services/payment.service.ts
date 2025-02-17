// import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
// import { PaytabsService } from './../../../../core/providers/payments/paytabs/infrastructure/services/paytabs.service';

import { Injectable } from '@nestjs/common';

// import { ClsService } from 'nestjs-cls';
// import Stripe from 'stripe';
// import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
// import { StripeService } from '../../../../core/providers/payments/stripe/infrastructure';
// import { Invoice, INVOICE_SERVICE_PROVIDER, InvoiceStatus } from '../../../invoice/domain';
// import { InvoiceService } from '../../../invoice/infrastructure';
// import { IPaymentRepository, IPaymentService, Payment, PAYMENT_REPOSITORY_PROVIDER } from '../../domain';

@Injectable()
export class PaymentService {
  //   constructor(
  //     private readonly clsService: ClsService,
  //     @Inject(INVOICE_SERVICE_PROVIDER)
  //     private readonly invoiceService: InvoiceService,
  //     @Inject(PAYMENT_REPOSITORY_PROVIDER)
  //     private readonly repo: IPaymentRepository,
  //     private stripeService: StripeService,
  //     private paytabsService: PaytabsService,
  //   ) {}
  //   private get currentUser(): any {
  //     return this.clsService.get('currentUser');
  //   }
  //   async getPayments(): Promise<Payment[]> {
  //     return await this.repo.getAll();
  //   }
  //   async queryPayments(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Payment>> {
  //     return await this.repo.query(page, limit, filters, order);
  //   }
  //   async getPayment(id: string): Promise<Payment> {
  //     return await this.repo.get(id);
  //   }
  //   async addPayment(payment: Partial<Payment>): Promise<Payment> {
  //     // Initiate some fields
  //     payment.createdBy = this.currentUser?.name;
  //     payment.createdAt = Date.now();
  //     return this.repo.add(payment).then(async addedPayment => {
  //       // Update the invoice status
  //       await this.invoiceService.updateInvoice({
  //         id: addedPayment.entityId,
  //         //TODO: FIX BELOW
  //         // paymentId: addedPayment.id,
  //         status: InvoiceStatus.PAID,
  //       });
  //       return addedPayment;
  //     });
  //   }
  //   async addPayments(payments: Partial<Payment>[]): Promise<Payment[]> {
  //     // Initiate some fields for each code
  //     payments.forEach(payment => {
  //       payment.createdBy = this.currentUser?.name;
  //       payment.createdAt = Date.now();
  //     });
  //     return this.repo.addBatch(payments).then(async addedPayments => {
  //       const updated = [];
  //       for (const payment of addedPayments) {
  //         updated.push({
  //           id: payment.entityId,
  //           paymentId: payment.id,
  //           status: InvoiceStatus.PAID,
  //         });
  //       }
  //       //TODO: Update the invoices after add update invoices usecase
  //       // await this.invoiceService.updateInvoices(updated);
  //       return addedPayments;
  //     });
  //   }
  //   async updatePayment(payments: Partial<Payment> & { id: string }): Promise<Payment> {
  //     // Update some fields
  //     payments.updatedBy = this.currentUser?.name;
  //     payments.updatedAt = Date.now();
  //     return await this.repo.update(payments);
  //   }
  //   async deletePayment(id: string): Promise<Payment> {
  //     return await this.repo.delete(id);
  //   }
  //   async createStripeInvoice(invoice: Invoice): Promise<string> {
  //     const x = await this.stripeService.createStripeInvoice(invoice);
  //     return x.hosted_invoice_url;
  //   }
  //   async createWebhookEndpoint(): Promise<Stripe.WebhookEndpoint> {
  //     return await this.stripeService.createWebhookEndpoint();
  //   }
  //   async handleStripeWebhook(payload: any): Promise<any> {
  //     try {
  //       const result = await this.stripeService.handleStripeWebhook(payload);
  //       const invoiceId = payload.data.object.metadata.mofawtarInvoice;
  //       const invoice = await this.invoiceService.getInvoice(invoiceId);
  //       if (result === 'payment_succeeded') {
  //         // Update the invoice status
  //         await this.invoiceService.updateInvoice({
  //           ...invoice,
  //           status: InvoiceStatus.PAID,
  //         });
  //       } else if (result === 'payment_failed') {
  //         Logger.warn('Payment failed for invoice: ' + invoiceId);
  //       }
  //       return result;
  //     } catch (error) {
  //       Logger.error(error);
  //       throw new InternalServerErrorException(error);
  //     }
  //   }
  //   async updateStripeApiKey(apiKey: string): Promise<any> {
  //     return await this.stripeService.updateStripeApiKey(apiKey);
  //   }
  //   async createPaytabsInvoice(data: any): Promise<any> {
  //     return await this.paytabsService.createInvoice(data);
  //   }
  //   async paytabsCallback(data: any): Promise<any> {
  //     const result: { invoiceId: string; paymentStatus: string } = await this.paytabsService.paytabsCallback(data);
  //     if (result.paymentStatus === 'A') {
  //       // Update the invoice status
  //       const invoice = await this.invoiceService.getInvoice(result.invoiceId);
  //       await this.invoiceService.updateInvoice({
  //         ...invoice,
  //         status: InvoiceStatus.PAID,
  //       });
  //     }
  //     return result;
  //   }
  //   async retrieveBalance(): Promise<any> {
  //     return await this.stripeService.retrieveBalance();
  //   }
  // }
}
