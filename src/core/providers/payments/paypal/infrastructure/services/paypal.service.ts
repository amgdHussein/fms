/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaypalService {
  private readonly base = 'https://api-m.sandbox.paypal.com';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Asynchronously generates an access token.
   *
   * @return {Promise<string>} the access token generated
   */
  async generateAccessToken(): Promise<string> {
    const clientId = this.configService.get<string>('paypal.clientId');
    const clientSecret = this.configService.get<string>('paypal.clientSecret');

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await this.httpService
      .post(`${this.base}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .toPromise();

    return response.data.access_token;
  }

  /**
   * Create an order with the given cart, value, and currency code.
   *
   * @param {any} cart - the cart object NOTE  probably don't need a cart #ask
   * @param {number} value - the value of the order
   * @param {string} currencyCode - the currency code for the order
   * @return {Promise<any>} a Promise that resolves to the order response
   */
  async createOrder(cart, value: number, currencyCode: string): Promise<any> {
    const accessToken = await this.generateAccessToken();
    const url = `${this.base}/v2/checkout/orders`;

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currencyCode || 'USD',
            value,
          },
        },
      ],
    };

    const response = await this.httpService
      .post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      .toPromise();

    return this.handleResponse(response);
    // create an order in database based on the response
    // this.createOrder({id:response.id, userId:req.user.id,status,total:invoice.total})
    // return "Order has been created"
  }

  /**
   * Capture an order using the provided order ID.
   *
   * @param {string} orderID - The ID of the order to capture
   * @return {Promise<any>} A promise that resolves with the captured order response
   */
  async captureOrder(orderID: string): Promise<any> {
    const accessToken = await this.generateAccessToken();
    const url = `${this.base}/v2/checkout/orders/${orderID}/capture`;

    const response = await this.httpService
      .post(url, null, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      .toPromise();

    return this.handleResponse(response);
  }

  /**
   * Handles the response from the API request.
   *
   * @param {any} response - the response from the API request
   * @return {Promise<any>} an object containing the JSON response and the HTTP status code
   */
  async handleResponse(response: any): Promise<any> {
    try {
      const jsonResponse = response.data;
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = response.data || 'Unknown error';
      throw new Error(errorMessage);
    }
  }
}
