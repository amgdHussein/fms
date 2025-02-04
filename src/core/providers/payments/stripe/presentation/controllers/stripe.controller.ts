// import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
// import { Stripe } from 'stripe';
// import { StripeService } from '../../infrastructure';

// @Controller('payments/stripe')
// export class StripeController {
//   private readonly logger = new Logger(StripeController.name);

//   constructor(private readonly stripeService: StripeService) {}

//   @Get('products')
//   async getProducts(): Promise<Stripe.Product[]> {
//     try {
//       const products = await this.stripeService.getProducts();
//       this.logger.log('Products fetched successfully');
//       return products;
//     } catch (error) {
//       this.logger.error('Failed to fetch products', error.stack);
//       throw new HttpException('Failed to fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get('customers')
//   async getCustomers(): Promise<Stripe.Customer[]> {
//     try {
//       const customers = await this.stripeService.getCustomers();
//       this.logger.log('Customers fetched successfully');
//       return customers;
//     } catch (error) {
//       this.logger.error('Failed to fetch customers', error.stack);
//       throw new HttpException('Failed to fetch customers', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Post('payments')
//   async addPayment(@Body() dto: any): Promise<any> {
//     return await this.stripeService.addPayment(
//       dto.amount,
//       dto.customer as string,
//       dto.description,
//       dto.currency,
//       dto.confirm,
//     );
//   }

//   @Get('sessions/create')
//   async createSession(@Body() invoice: any) {
//     try {
//       // const invoiceResult = await this.invoiceService.getInvoice(invoice.id);
//       return await this.stripeService.createSession(invoice);
//     } catch (error) {
//       this.logger.error('Failed to fetch customers', error.stack);
//       throw new HttpException('Failed to fetch customers', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Post('webhook')
//   async handleStripeWebhook(@Body() payload: any): Promise<any> {
//     return await this.stripeService.handleStripeWebhook(payload);
//   }
// }
