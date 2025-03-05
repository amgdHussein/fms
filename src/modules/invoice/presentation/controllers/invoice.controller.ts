import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryDto } from '../../../../core/dtos';
import {
  AddInvoice,
  DeleteInvoice,
  GetClientInvoices,
  GetInvoice,
  GetInvoiceItems,
  GetInvoices,
  GetOrganizationInvoices,
  UpdateInvoice,
} from '../../application';
import { INVOICE_USECASE_PROVIDERS } from '../../domain';
import { AddInvoiceDto, InvoiceDto, InvoiceItemDto, UpdateInvoiceDto } from '../dtos';

@ApiTags('Invoices')
@Controller()
export class InvoiceController {
  constructor(
    @Inject(INVOICE_USECASE_PROVIDERS.GET_INVOICE)
    private readonly getInvoiceUsecase: GetInvoice,

    @Inject(INVOICE_USECASE_PROVIDERS.ADD_INVOICE)
    private readonly addInvoiceUsecase: AddInvoice,

    @Inject(INVOICE_USECASE_PROVIDERS.UPDATE_INVOICE)
    private readonly updateInvoiceUsecase: UpdateInvoice,

    @Inject(INVOICE_USECASE_PROVIDERS.GET_INVOICES)
    private readonly getInvoicesUsecase: GetInvoices,

    @Inject(INVOICE_USECASE_PROVIDERS.DELETE_INVOICE)
    private readonly deleteInvoiceUsecase: DeleteInvoice,

    @Inject(INVOICE_USECASE_PROVIDERS.GET_CLIENT_INVOICES)
    private readonly getClientInvoicesUsecase: GetClientInvoices,

    @Inject(INVOICE_USECASE_PROVIDERS.GET_ORGANIZATION_INVOICES)
    private readonly getOrganizationInvoicesUsecase: GetOrganizationInvoices,

    @Inject(INVOICE_USECASE_PROVIDERS.GET_INVOICE_ITEMS)
    private readonly getInvoiceItemsUsecase: GetInvoiceItems,
  ) {}

  //TODO: Revise => I ADD QUERY FILTERS TO THIS ENDPOINT
  @Post('invoices/query')
  // @ApiQuery({
  //   type: Number,
  //   name: 'page',
  //   required: false,
  //   example: 1,
  //   description: 'The page number to retrieve, for pagination. Defaults to 1 if not provided.',
  // })
  // @ApiQuery({
  //   type: Number,
  //   name: 'limit',
  //   required: false,
  //   example: 15,
  //   description: 'The number of staff per page, for pagination. Defaults to 15 if not provided.',
  // })
  @ApiOperation({ summary: 'Get all/N invoices with/without filter the results.' })
  @ApiResponse({
    type: [InvoiceDto],
    description: 'List of invoices that meet all the query filters, and with length less than or equal to limit number.',
  })
  async getInvoices(@Body() query: QueryDto): Promise<InvoiceDto[]> {
    return this.getInvoicesUsecase.execute(query.filters, query.page, query.limit, query.order);
  }

  // OLD ENDPOINT
  // async getInvoices(@Body() query: QueryDto): Promise<QueryResultDto<EInvoiceDto>> {
  //   const { page, limit, filters, order } = query;
  //   return await this.invoiceService.getInvoices(page, limit, filters, order);
  // }

  // @UseGuards(AuthenticationGuard)
  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the invoice',
  })
  @ApiResponse({
    type: InvoiceDto,
    description: 'Invoice with specified id.',
  })
  async getInvoice(@Param('id') id: string): Promise<InvoiceDto> {
    return this.getInvoiceUsecase.execute(id);
  }

  @Get('invoices/:id/items')
  @ApiOperation({ summary: 'Get invoice items by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the invoice',
  })
  @ApiResponse({
    type: Array<InvoiceItemDto>,
    description: 'Invoice with specified id.',
  })
  async getInvoiceItems(@Param('id') id: string): Promise<InvoiceItemDto[]> {
    return this.getInvoiceItemsUsecase.execute(id);
  }

  @Post('invoices')
  @ApiOperation({ summary: 'Add new invoice.' })
  @ApiBody({
    type: AddInvoiceDto,
    required: true,
    description: 'Invoice info required to create a new document into database.',
  })
  @ApiResponse({
    type: InvoiceDto,
    description: 'Invoice recently added.',
  })
  async addInvoice(@Body() dto: AddInvoiceDto): Promise<InvoiceDto> {
    return this.addInvoiceUsecase.execute({ ...dto, issue: dto.issue || false });
  }

  @Put('invoices/:id')
  @ApiOperation({ summary: 'Update invoice info.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the invoice',
  })
  @ApiBody({
    type: UpdateInvoiceDto,
    required: true,
    description: 'Optional invoice info to be updated.',
  })
  @ApiResponse({
    type: InvoiceDto,
    description: 'Updated invoice.',
  })
  async updateInvoice(@Param('id') id: string, @Body() entity: UpdateInvoiceDto): Promise<InvoiceDto> {
    return this.updateInvoiceUsecase.execute({ ...entity, id });
  }

  @Delete('invoices/:id')
  @ApiOperation({ summary: 'Delete invoice by id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'Invoice id that required to delete the invoice data from database.',
  })
  @ApiResponse({
    type: InvoiceDto,
    description: 'Invoice deleted.',
  })
  async deleteInvoice(@Param('id') id: string): Promise<InvoiceDto> {
    return this.deleteInvoiceUsecase.execute(id);
  }

  @Get('clients/:clientId/invoices')
  @ApiOperation({ summary: 'Get all active invoices for a client.' })
  @ApiParam({
    name: 'clientId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the client',
  })
  @ApiResponse({
    type: Array<InvoiceDto>,
    description: 'List of invoices for the client.',
  })
  async getClientInvoices(@Param('clientId') clientId: string): Promise<InvoiceDto[]> {
    return this.getClientInvoicesUsecase.execute(clientId);
  }

  @Get('organizations/:organizationId/invoices')
  @ApiOperation({ summary: 'Get all active invoices for a organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the organization.',
  })
  @ApiResponse({
    type: Array<InvoiceDto>,
    description: 'List of invoices for the organization.',
  })
  async getOrganizationInvoices(@Param('organizationId') organizationId: string): Promise<InvoiceDto[]> {
    return this.getOrganizationInvoicesUsecase.execute(organizationId);
  }
}
