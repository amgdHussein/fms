import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { Public } from '../../../../core/decorators';
import { QueryDto, QueryResultDto } from '../../../../core/dtos';
import { Invoice } from '../../../invoice/domain';
import {
  AddPayment,
  AddPayments,
  CreatePaytabsInvoice,
  CreateStripeInvoice,
  CreateWebhookEndpoint,
  DeletePayment,
  GetPayment,
  HandleStripeWebhook,
  PaytabsCallback,
  QueryPayments,
  RetrieveBalance,
  UpdatePayment,
  UpdateStripeApiKey,
} from '../../application';
import { PAYMENT_USECASE_PROVIDERS } from '../../domain';
import { AddPaymentsDto, PaymentDto } from '../dtos';
import { AddPaymentDto } from '../dtos/add-payment.dto';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(
    @Inject(PAYMENT_USECASE_PROVIDERS.GET_PAYMENT)
    private readonly getPaymentUsecase: GetPayment,

    @Inject(PAYMENT_USECASE_PROVIDERS.ADD_PAYMENT)
    private readonly addPaymentUsecase: AddPayment,

    @Inject(PAYMENT_USECASE_PROVIDERS.ADD_PAYMENTS)
    private readonly addPaymentsUsecase: AddPayments,

    @Inject(PAYMENT_USECASE_PROVIDERS.UPDATE_PAYMENT)
    private readonly updatePaymentUsecase: UpdatePayment,

    @Inject(PAYMENT_USECASE_PROVIDERS.QUERY_PAYMENTS)
    private readonly queryPaymentsUsecase: QueryPayments,

    @Inject(PAYMENT_USECASE_PROVIDERS.DELETE_PAYMENT)
    private readonly deletePaymentUsecase: DeletePayment,

    @Inject(PAYMENT_USECASE_PROVIDERS.CREATE_STRIPE_INVOICE)
    private readonly createStripeInvoiceUsecase: CreateStripeInvoice,

    @Inject(PAYMENT_USECASE_PROVIDERS.CREATE_WEBHOOK_ENDPOINT)
    private readonly createWebhookEndpointUsecase: CreateWebhookEndpoint,

    @Inject(PAYMENT_USECASE_PROVIDERS.HANDLE_STRIPE_WEBHOOK)
    private readonly handleStripeWebhookUsecase: HandleStripeWebhook,

    @Inject(PAYMENT_USECASE_PROVIDERS.CREATE_PAYTABS_INVOICE)
    private readonly createPaytabsInvoiceUsecase: CreatePaytabsInvoice,

    @Inject(PAYMENT_USECASE_PROVIDERS.PAYTABS_CALLBACK)
    private readonly paytabsCallbackUsecase: PaytabsCallback,

    @Inject(PAYMENT_USECASE_PROVIDERS.RETRIEVE_STRIPE_BALANCE)
    private readonly retrieveBalanceUsecase: RetrieveBalance,

    @Inject(PAYMENT_USECASE_PROVIDERS.UPDATE_STRIPE_API_KEY)
    private readonly updateStripeApiKeyUsecase: UpdateStripeApiKey,
  ) {}

  @Post('search')
  @Public()
  @ApiOperation({ summary: 'Get all/N payments with/without filter the results.' })
  @ApiBody({
    type: QueryDto,
    required: false,
    description: 'Object contains List of query params are applied on the database, sort by field, as well as number of payment needed.',
  })
  @ApiResponse({
    type: QueryResultDto<PaymentDto>,
    description: 'List of payments that meet all the query filters, and with length less than or equal to limit number.',
  })
  async queryPayments(@Body() query: QueryDto): Promise<QueryResultDto<PaymentDto>> {
    // console.log('query', query);

    const { page, limit, filters, order } = query;
    return this.queryPaymentsUsecase.execute(page, limit, filters, order);
  }

  @Get(':id')
  // @Public()
  @ApiOperation({ summary: 'Get Payment by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'the id of the payment',
  })
  @ApiResponse({
    type: PaymentDto,
    description: 'Payment with specified id.',
  })
  async getPayment(@Param('id') id: string): Promise<PaymentDto> {
    return this.getPaymentUsecase.execute(id);
  }

  @Post()
  // @Public()
  @ApiOperation({ summary: 'Add new Payment.' })
  @ApiBody({
    type: AddPaymentDto,
    required: true,
    description: 'Payment info required to create a new document into database.',
  })
  @ApiResponse({
    type: PaymentDto,
    description: 'Payment recently added.',
  })
  async addPayment(@Body() entity: AddPaymentDto): Promise<PaymentDto> {
    return this.addPaymentUsecase.execute({
      id: '',
      ...entity,
    });
  }

  // async addPayments(@Body() dto: AddPayments): Promise<PaymentDto[]> {
  //   return this.addPaymentsUsecase.execute(dto.payments);
  // }

  @Post('multiple')
  @ApiBody({
    type: AddPaymentsDto,
    required: true,
    description: 'Payments info to be added.',
  })
  @ApiResponse({
    type: Array<PaymentDto>,
    description: 'payments recently added.',
  })
  async addPayments(@Body() dto: AddPaymentsDto): Promise<PaymentDto[]> {
    console.log('dto', dto);
    const payments = dto.payments.map(payment => ({
      id: '',
      ...payment,
    }));

    return this.addPaymentsUsecase.execute(payments);
  }

  @Put()
  @ApiOperation({ summary: 'Update payment info.' })
  @ApiBody({
    type: UpdatePaymentDto,
    required: true,
    description: 'Optional payment info to be updated.',
  })
  @ApiResponse({
    type: PaymentDto,
    description: 'Updated payment.',
  })
  async updatePayment(@Body() entity: UpdatePaymentDto & { id: string }): Promise<PaymentDto> {
    return this.updatePaymentUsecase.execute(entity);
  }

  @Post('stripe/create-invoice')
  @Public()
  @ApiOperation({ summary: 'Create a new invoice in stripe.' })
  @ApiResponse({
    type: String,
    description: 'Stripe invoice url.',
  })
  async createStripeInvoice(@Body() invoice: Invoice): Promise<string> {
    return this.createStripeInvoiceUsecase.execute(invoice);
  }

  // TODO: Call ones only to create the webhook endpoint
  @Post('stripe/create-webhook')
  // @Public()
  @ApiOperation({ summary: 'Create a new webhook endpoint to listen to some events.' })
  async createWebhookEndpoint(): Promise<Stripe.WebhookEndpoint> {
    return this.createWebhookEndpointUsecase.execute();
  }

  // TODO: Handle the webhook event
  @Post('stripe/handle-webhook')
  @Public()
  @ApiOperation({ summary: 'Handle a webhook event' })
  async handleStripeWebhook(@Body() payload: any): Promise<any> {
    return this.handleStripeWebhookUsecase.execute(payload);
  }

  // TODO: Change the stripe api key
  @Post('stripe/change-apikey')
  // @Public()
  @ApiOperation({ summary: 'Handle a webhook event' })
  async updateStripeApiKey(@Body() payload: any): Promise<any> {
    return this.updateStripeApiKeyUsecase.execute(payload.apiKey);
  }

  @Get('stripe/retrieve-balance')
  async retrieveBalance(): Promise<any> {
    return this.retrieveBalanceUsecase.execute();
  }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete payment by id.' })
  // @ApiParam({
  //   name: 'id',
  //   example: 'K05ThPKxfugr9yYhA82Z',
  //   required: true,
  //   type: String,
  //   description: 'Payment id that required to delete the payment data from database.',
  // })
  // @ApiResponse({
  //   type: PaymentDto,
  //   description: 'Payment deleted.',
  // })
  // async deletePayment(@Param('id') id: string): Promise<PaymentDto> {
  //   return this.deletePaymentUsecase.execute(id);
  // }

  @Post('paytabs/create-invoice')
  @Public()
  async createPaytabsInvoice(@Body() body: { invoice: Invoice; profileId: string; serverKey: string }): Promise<any> {
    return this.createPaytabsInvoiceUsecase.execute(body);
  }

  @Post('paytabs/callback')
  @Public()
  async paytabsCallback(@Body() body: any): Promise<any> {
    return this.paytabsCallbackUsecase.execute(body);
  }
}
