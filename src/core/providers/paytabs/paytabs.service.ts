import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { catchError, firstValueFrom, map } from 'rxjs';

import { HTTP_PROVIDER } from '../../constants';
import { CurrencyCode } from '../../enums';

import { PayTabsInvoice, PaytabsInvoiceParams, TransactionClass, TransactionType } from './entities';
import { PayTabsConfigs } from './paytabs.config';

@Injectable()
export class PayTabsService {
  private readonly BASE_URL = 'https://secure-egypt.paytabs.com';

  @Inject(HTTP_PROVIDER)
  private readonly http: HttpService;

  constructor(private readonly configs: PayTabsConfigs) {}

  async createHostedPaymentPage(data: PaytabsInvoiceParams): Promise<PayTabsInvoice> {
    const endpoint = `${this.BASE_URL}/payment/request`;

    try {
      const request = this.http.post(endpoint, data, {
        headers: {
          Authorization: `${this.configs.serverKey}`,
        },
      });

      const response = await firstValueFrom(request);
      return response.data;
    } catch (error) {
      this.handlePayTabsError(error);
    }
  }

  // ? Invoices

  async addInvoice(invoice: { id: string; currency: CurrencyCode; amount: number; clientName: string }): Promise<PayTabsInvoice> {
    const endpoint = `${this.BASE_URL}/payment/invoice/new`;

    const payTabsInvoice: PaytabsInvoiceParams = {
      profile_id: this.configs.profileId,
      tran_type: TransactionType.SALE,
      tran_class: TransactionClass.ECOM,
      cart_currency: invoice.currency,
      cart_amount: invoice.amount,
      cart_id: invoice.id,
      cart_description: 'Created By Mofawtar invoice for client ' + invoice.clientName,
      hide_shipping: true,
      customer_details: {
        name: invoice.clientName,
        // country: 'EGY',
      },
      invoice: {
        lang: 'en',
        total: invoice.amount,
        expiry_date: moment().add(30, 'days').toISOString(),
        // due_date: new Date(+new Date()).toISOString(), // now
        disable_edit: true,
        line_items: [
          {
            sku: invoice.id,
            description: `Invoice for ${invoice.clientName} Created By Mofawtar`,
            unit_cost: invoice.amount,
            quantity: 1,
            net_total: invoice.amount,
            total: invoice.amount,
          },
        ],
      },
      callback: `${process.env.PROD_URL}/payments/paytabs/callback`,
      return: 'https://www.dashboard.mofawtar.com/',
    };

    const request = this.http
      .post<PayTabsInvoice>(endpoint, payTabsInvoice, {
        headers: { Authorization: `${this.configs.serverKey}` },
      })
      .pipe(
        map(response => response.data),
        catchError(this.handlePayTabsError),
      );

    return firstValueFrom(request);
  }

  private readonly handlePayTabsError = (error: any) => {
    throw new Error(`PayTabs Error: ${error.response?.data?.message || error.message}`);
  };
}
