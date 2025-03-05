import { QueryFilter, QueryOrder } from '../../../../core/queries';
import { Payment } from '../entities';

export interface IPaymentService {
  getPayments(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment>;
  addPayment(payment: Partial<Payment>): Promise<Payment>;
  updatePayment(payment: Partial<Payment> & { id: string }): Promise<Payment>;
  deletePayment(id: string): Promise<Payment>;

  // createStripeInvoice(invoice: Invoice): Promise<string>;
  // createWebhookEndpoint(): Promise<Stripe.WebhookEndpoint>;
  // handleStripeWebhook(payload: any): Promise<any>;
  // updateStripeApiKey(apiKey: string): Promise<any>;
  // createPaytabsInvoice(data: any): Promise<any>;
  // paytabsCallback(data: any): Promise<any>;
  // retrieveBalance(): Promise<any>;
}
