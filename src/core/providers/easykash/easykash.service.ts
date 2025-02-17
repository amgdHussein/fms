import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { EASY_KASH_CONFIGS_PROVIDER, HTTP_PROVIDER } from '../../constants';
import { EasyKashConfigs } from './easykash.config';
import { Order } from './easykash.entity';

@Injectable()
export class EasyKashService {
  // `https://example.com/checkout/order-received/${this.orderId}/`;

  constructor(
    @Inject(HTTP_PROVIDER)
    private readonly http: HttpService,

    @Inject(EASY_KASH_CONFIGS_PROVIDER)
    private readonly configs: EasyKashConfigs,
  ) {}

  async processPayment(req: any): Promise<any> {
    // TODO: REFINE AND REMOVE MOCK DATA
    const order_id = req.body.order_id;
    const order: Order = {
      orderId: '12345',
      billingFirstName: 'John',
      billingLastName: 'Doe',
      billingEmail: 'john.doe@example.com',
      billingPhone: '123456789',
      total: 100,
    };

    const order_price = order.total;
    const first_name = order.billingFirstName;
    const last_name = order.billingLastName;
    const email = order.billingEmail;
    const phone = order.billingPhone;

    const name = `${first_name} ${last_name}`;
    const success_url = `https://example.com/?action=easykash_pay&order_id=${order_id}&`;

    const data = {
      amount: order_price,
      currency: 'EGP', // Modify this based on your requirements
      paymentOptions: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 14, 17],
      cashExpiry: 12,
      name: name,
      email: email,
      mobile: phone,
      redirectUrl: success_url,
      customerReference: order_id,
      type: 'Direct Pay',
    };

    const request = this.http.post('https://back.easykash.net/api/directpayv1/pay', data, {
      headers: {
        'Authorization': this.configs.secretKey,
        'Content-Type': 'application/json',
      },
    });

    const response = firstValueFrom(request);

    await response
      .then(response => {
        const return_url = response.data.redirectUrl;
        return {
          result: 'success',
          redirect: return_url,
        };
      })
      .catch(error => {
        console.error('Error processing payment:', error);
        throw new Error('Internal Server Error');
      });
  }
}
