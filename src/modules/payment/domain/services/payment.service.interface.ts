import Stripe from 'stripe';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/queries';
import { Invoice } from '../../../invoice/domain';
import { Payment } from '../entities';

export interface IPaymentService {
  getPayments(): Promise<Payment[]>;
  queryPayments(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Payment>>;
  getPayment(id: string): Promise<Payment>;
  addPayment(payment: Partial<Payment>): Promise<Payment>;
  addPayments(payments: Partial<Payment>[]): Promise<Payment[]>;
  updatePayment(payment: Partial<Payment> & { id: string }): Promise<Payment>;
  deletePayment(id: string): Promise<Payment>;
  createStripeInvoice(invoice: Invoice): Promise<string>;
  createWebhookEndpoint(): Promise<Stripe.WebhookEndpoint>;
  handleStripeWebhook(payload: any): Promise<any>;
  updateStripeApiKey(apiKey: string): Promise<any>;
  createPaytabsInvoice(data: any): Promise<any>;
  paytabsCallback(data: any): Promise<any>;
  retrieveBalance(): Promise<any>;
}
