import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Order } from '../..';

@Injectable()
export class EasykashService {
  private readonly private_key = '1u4f62xa27gycxuv';

  processPayment(req: any): any {
    const order_id = req.body.order_id;
    const order = new Order('12345', 'John', 'Doe', 'john.doe@example.com', '123456789', 100);

    const order_price = order.total;
    const first_name = order.getBillingFirstName();
    const last_name = order.getBillingLastName();
    const email = order.getBillingEmail();
    const phone = order.getBillingPhone();

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

    return axios
      .post('https://back.easykash.net/api/directpayv1/pay', data, {
        headers: {
          'Authorization': this.private_key,
          'Content-Type': 'application/json',
        },
      })
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
