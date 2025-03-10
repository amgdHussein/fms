import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryDto, QueryResultDto } from '../../../../core/dtos';
import { AddPayment, DeletePayment, GetPayment, GetPayments, UpdatePayment } from '../../application';
import { PAYMENT_USECASE_PROVIDERS } from '../../domain';
import { PaymentDto } from '../dtos';
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

    @Inject(PAYMENT_USECASE_PROVIDERS.UPDATE_PAYMENT)
    private readonly updatePaymentUsecase: UpdatePayment,

    @Inject(PAYMENT_USECASE_PROVIDERS.GET_PAYMENTS)
    private readonly getPaymentsUsecase: GetPayments,

    @Inject(PAYMENT_USECASE_PROVIDERS.DELETE_PAYMENT)
    private readonly deletePaymentUsecase: DeletePayment,
  ) {}

  //TODO: ADD ORG ID ??
  @Post('search')
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
  async queryPayments(@Body() query: QueryDto): Promise<PaymentDto[]> {
    //TODO: RETURN QueryResult<Payment>

    const { page, limit, filters, order } = query;
    return this.getPaymentsUsecase.execute(page, limit, filters, order);
  }

  @Get(':id')
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
    console.log('entity', entity);

    return this.addPaymentUsecase.execute({
      id: '',
      ...entity,
    });
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment by id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'Payment id that required to delete the payment data from database.',
  })
  @ApiResponse({
    type: PaymentDto,
    description: 'Payment deleted.',
  })
  async deletePayment(@Param('id') id: string): Promise<PaymentDto> {
    return this.deletePaymentUsecase.execute(id);
  }
}
