import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryDto, QueryResultDto } from '../../../../core/dtos';

import { AddReceipt, AddReceipts, DeleteReceipt, GetReceipt, QueryReceipts, UpdateReceipt } from '../../application';
import { RECEIPT_SERVICE_PROVIDER, RECEIPT_USECASE_PROVIDERS } from '../../domain';
import { ReceiptService } from '../../infrastructure';

import { AddReceiptsDto, ReceiptDto } from '../dtos';
import { AddReceiptDto } from '../dtos/add-receipt.dto';
import { UpdateReceiptDto } from '../dtos/update-receipt.dto';

@ApiTags('Receipts')
@Controller('receipts')
export class ReceiptController {
  constructor(
    @Inject(RECEIPT_USECASE_PROVIDERS.GET_RECEIPT)
    private readonly getReceiptUsecase: GetReceipt,

    @Inject(RECEIPT_USECASE_PROVIDERS.ADD_RECEIPT)
    private readonly addReceiptUsecase: AddReceipt,

    @Inject(RECEIPT_USECASE_PROVIDERS.ADD_RECEIPTS)
    private readonly addReceiptsUsecase: AddReceipts,

    @Inject(RECEIPT_USECASE_PROVIDERS.UPDATE_RECEIPT)
    private readonly updateReceiptUsecase: UpdateReceipt,

    @Inject(RECEIPT_USECASE_PROVIDERS.QUERY_RECEIPTS)
    private readonly queryReceiptsUsecase: QueryReceipts,

    @Inject(RECEIPT_USECASE_PROVIDERS.DELETE_RECEIPT)
    private readonly deleteReceiptUsecase: DeleteReceipt,

    @Inject(RECEIPT_SERVICE_PROVIDER)
    private readonly receiptService: ReceiptService,
  ) {}

  @Post('search')
  // @Public()
  @ApiOperation({ summary: 'Get all/N receipts with/without filter the results.' })
  @ApiBody({
    type: QueryDto,
    required: false,
    description: 'Object contains List of query params are applied on the database, sort by field, as well as number of payment needed.',
  })
  @ApiResponse({
    type: QueryResultDto<ReceiptDto>,
    description: 'List of receipts that meet all the query filters, and with length less than or equal to limit number.',
  })
  async queryReceipts(@Body() query: QueryDto): Promise<QueryResultDto<ReceiptDto>> {
    console.log('query', query);

    const { page, limit, filters, order } = query;
    return this.queryReceiptsUsecase.execute(page, limit, filters, order);
  }

  @Get(':id')
  // @Public()
  @ApiOperation({ summary: 'Get Receipt by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'the id of the payment',
  })
  @ApiResponse({
    type: ReceiptDto,
    description: 'Receipt with specified id.',
  })
  async getReceipt(@Param('id') id: string): Promise<ReceiptDto> {
    return this.getReceiptUsecase.execute(id);
  }

  @Post()
  // @Public()
  @ApiOperation({ summary: 'Add new Receipt.' })
  @ApiBody({
    type: AddReceiptDto,
    required: true,
    description: 'Receipt info required to create a new document into database.',
  })
  @ApiResponse({
    type: ReceiptDto,
    description: 'Receipt recently added.',
  })
  async addReceipt(@Body() entity: any): Promise<ReceiptDto> {
    return this.addReceiptUsecase.execute({
      id: '',
      ...entity,
    });
  }

  // async addReceipts(@Body() dto: AddReceipts): Promise<ReceiptDto[]> {
  //   return this.addReceiptsUsecase.execute(dto.receipts);
  // }

  @Post('multiple')
  @ApiBody({
    type: AddReceiptsDto,
    required: true,
    description: 'Receipts info to be added.',
  })
  @ApiResponse({
    type: Array<ReceiptDto>,
    description: 'Receipts recently added.',
  })
  async addReceipts(@Body() dto: AddReceiptsDto): Promise<ReceiptDto[]> {
    console.log('dto', dto);
    const receipts = dto.receipts.map(payment => ({
      id: '',
      ...payment,
    }));

    return this.addReceiptsUsecase.execute(receipts);
  }

  @Put()
  @ApiOperation({ summary: 'Update payment info.' })
  @ApiBody({
    type: UpdateReceiptDto,
    required: true,
    description: 'Optional payment info to be updated.',
  })
  @ApiResponse({
    type: ReceiptDto,
    description: 'Updated payment.',
  })
  async updateReceipt(@Body() entity: UpdateReceiptDto & { id: string }): Promise<ReceiptDto> {
    return this.updateReceiptUsecase.execute(entity);
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

  @Post('eta')
  async sendToEta(@Body() body: ReceiptDto): Promise<any> {
    return await this.receiptService.sendToEta(body);
  }

  @Post('eta/multiple')
  async sendMultipleToEta(@Body() body: ReceiptDto[]): Promise<any> {
    return await this.receiptService.sendMultipleToEta(body);
  }
}
