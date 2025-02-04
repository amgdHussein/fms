import { Controller, Post, Body } from '@nestjs/common';
import { PaypalService } from '../../infrastructure/services/paypal.service';

@Controller('api/orders')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post()
  async createOrder(@Body() cart: any): Promise<any> {
    return this.paypalService.createOrder(cart, 99.99, 'USD');
  }

  @Post(':orderID/capture')
  async captureOrder(orderID: string): Promise<any> {
    return this.paypalService.captureOrder(orderID);
  }
}
