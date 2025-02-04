import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Invoice } from '../../../../../../modules/invoice/domain';
import { HTTP_PROVIDER } from '../../../../../constants';
import { PaytabsInvoiceRequest, PayTabsPaymentRequest, PayTabsPaymentResponse, TransactionClass, TransactionType } from '../../domain';

@Injectable()
export class PaytabsService {
  private readonly BASE_URL = 'https://secure-egypt.paytabs.com';
  constructor(
    @Inject(HTTP_PROVIDER)
    private readonly http: HttpService,
  ) {}

  // Create Payment Page
  async createHostedPaymentPage(data: PayTabsPaymentRequest, serverKey: string): Promise<any> {
    const endpoint = `${this.BASE_URL}/payment/request`;

    try {
      const response = await axios.post(endpoint, data, {
        headers: {
          Authorization: `${serverKey}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`PayTabs Error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Create Invoice
  async createInvoice(body: { invoice: Invoice; profileId: string; serverKey: string }): Promise<any> {
    const endpoint = `${this.BASE_URL}/payment/invoice/new`;
    try {
      const payTabsInvoice: PaytabsInvoiceRequest = {
        profile_id: body.profileId,
        tran_type: TransactionType.sale,
        tran_class: TransactionClass.ecom,
        cart_currency: body.invoice.currency.code,
        cart_amount: body.invoice.totalAmount,
        cart_id: body.invoice.id,
        cart_description: 'Created By Mofawtar invoice for client ' + body.invoice.receiver.name,
        hide_shipping: true,
        customer_details: {
          name: body.invoice.receiver.name,
          // country: 'EGY',
        },
        invoice: {
          lang: 'en',
          total: body.invoice.totalAmount,
          expiry_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // 30 days from now
          // due_date: new Date(+new Date()).toISOString(), // now
          disable_edit: true,
          line_items: [
            {
              sku: body.invoice.id,
              description: `Invoice for ${body.invoice.receiver.name} Created By Mofawtar`,
              unit_cost: body.invoice.totalAmount,
              quantity: 1,
              net_total: body.invoice.totalAmount,
              total: body.invoice.totalAmount,
            },
          ],
        },
        callback: `${process.env.PROD_URL}/payments/paytabs/callback`,
        return: 'https://www.dashboard.mofawtar.com/',
      };
      const response = await this.http
        .post(endpoint, payTabsInvoice, {
          headers: {
            Authorization: `${body.serverKey}`,
          },
        })
        .toPromise();
      return response.data;
    } catch (error) {
      Logger.error(error?.data?.message || error?.message || error);
      throw new Error(`PayTabs Error: ${error?.data?.message || error?.message || error}`);
    }
  }

  async paytabsCallback(body: PayTabsPaymentResponse): Promise<any> {
    return { invoiceId: body['cart_id'], paymentStatus: body['payment_result']['response_status'] };
  }
}
