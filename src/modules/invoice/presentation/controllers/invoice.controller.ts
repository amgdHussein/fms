import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryDto, QueryResultDto } from '../../../../core/dtos';
import {
  AddInvoice,
  DeleteInvoice,
  GetClientInvoices,
  GetInvoice,
  GetInvoiceItems,
  GetOrganizationInvoices,
  QueryInvoices,
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

    @Inject(INVOICE_USECASE_PROVIDERS.QUERY_INVOICES)
    private readonly queryInvoicesUsecase: QueryInvoices,

    @Inject(INVOICE_USECASE_PROVIDERS.DELETE_INVOICE)
    private readonly deleteInvoiceUsecase: DeleteInvoice,

    @Inject(INVOICE_USECASE_PROVIDERS.GET_CLIENT_INVOICES)
    private readonly getClientInvoicesUsecase: GetClientInvoices,

    @Inject(INVOICE_USECASE_PROVIDERS.GET_ORGANIZATION_INVOICES)
    private readonly getOrganizationInvoicesUsecase: GetOrganizationInvoices,

    @Inject(INVOICE_USECASE_PROVIDERS.GET_INVOICE_ITEMS)
    private readonly getInvoiceItemsUsecase: GetInvoiceItems,
  ) {}

  @Get('invoices')
  @ApiOperation({ summary: 'Get all/N invoices with/without filter the results.' })
  @ApiBody({
    type: QueryDto,
    required: false,
    description: 'Object contains List of query params are applied on the database, sort by field, as well as number of invoice needed.',
  })
  @ApiResponse({
    type: QueryResultDto<InvoiceDto>,
    description: 'List of invoices that meet all the query filters, and with length less than or equal to limit number.',
  })
  async queryInvoices(@Query() query: QueryDto): Promise<QueryResultDto<InvoiceDto>> {
    const { page, limit, filters, order } = query;
    return this.queryInvoicesUsecase.execute(page, limit, filters, order);
  }

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

  @Post('organizations/:organizationId/invoices')
  @ApiOperation({ summary: 'Add new invoice.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the organization',
  })
  @ApiBody({
    type: AddInvoiceDto,
    required: true,
    description: 'Invoice info required to create a new document into database.',
  })
  @ApiResponse({
    type: InvoiceDto,
    description: 'Invoice recently added.',
  })
  async addInvoice(@Param('organizationId') id: string, @Body() dto: AddInvoiceDto): Promise<InvoiceDto> {
    return this.addInvoiceUsecase.execute({ ...dto, organizationId: id, issue: dto.issue || false });
  }

  @Put('invoices')
  @ApiOperation({ summary: 'Update invoice info.' })
  @ApiBody({
    type: UpdateInvoiceDto,
    required: true,
    description: 'Optional invoice info to be updated.',
  })
  @ApiResponse({
    type: InvoiceDto,
    description: 'Updated invoice.',
  })
  async updateInvoice(@Body() entity: UpdateInvoiceDto): Promise<InvoiceDto> {
    return this.updateInvoiceUsecase.execute(entity);
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
