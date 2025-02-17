import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AddBillingAccount, DeleteBillingAccount, GetBillingAccount, GetBillingAccounts, UpdateBillingAccount } from '../../application';
import { BILLING_ACCOUNT_USECASE_PROVIDERS } from '../../domain';
import { AddBillingAccountDto, BillingAccountDto, UpdateBillingAccountDto } from '../dtos';

@ApiTags('Billing Accounts')
@Controller()
export class BillingAccountController {
  constructor(
    @Inject(BILLING_ACCOUNT_USECASE_PROVIDERS.GET_BILLING_ACCOUNT)
    private readonly getBillingAccountUsecase: GetBillingAccount,

    @Inject(BILLING_ACCOUNT_USECASE_PROVIDERS.ADD_BILLING_ACCOUNT)
    private readonly addBillingAccountUsecase: AddBillingAccount,

    @Inject(BILLING_ACCOUNT_USECASE_PROVIDERS.UPDATE_BILLING_ACCOUNT)
    private readonly updateBillingAccountUsecase: UpdateBillingAccount,

    @Inject(BILLING_ACCOUNT_USECASE_PROVIDERS.DELETE_BILLING_ACCOUNT)
    private readonly deleteBillingAccountUsecase: DeleteBillingAccount,

    @Inject(BILLING_ACCOUNT_USECASE_PROVIDERS.GET_BILLING_ACCOUNTS)
    private readonly getBillingAccountsUsecase: GetBillingAccounts,
  ) {}

  @Get('billing-accounts/:id')
  @ApiOperation({ summary: 'Retrieve a specific billing account by its ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'BA12345',
    required: true,
    description: 'The unique identifier of the billing account.',
  })
  @ApiResponse({
    type: BillingAccountDto,
    description: 'Details of the billing account with the specified ID.',
  })
  async getBillingAccount(@Param('id') id: string): Promise<BillingAccountDto> {
    return this.getBillingAccountUsecase.execute(id);
  }

  @Get('organizations/:organizationId/billing-accounts')
  @ApiOperation({ summary: 'Retrieve all billing accounts associated with a specific organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiResponse({
    type: [BillingAccountDto],
    description: 'List of billing accounts belonging to the organization.',
  })
  async getBillingAccounts(@Param('organizationId') organizationId: string): Promise<BillingAccountDto[]> {
    return this.getBillingAccountsUsecase.execute(organizationId);
  }

  @Post('billing-accounts')
  @ApiOperation({ summary: 'Create a new billing account.' })
  @ApiBody({
    type: AddBillingAccountDto,
    required: true,
    description: 'Details required to create a billing account.',
  })
  @ApiResponse({
    type: BillingAccountDto,
    description: 'The newly created billing account.',
  })
  async addBillingAccount(@Body() dto: AddBillingAccountDto): Promise<BillingAccountDto> {
    return this.addBillingAccountUsecase.execute(dto);
  }

  @Put('billing-accounts/:id')
  @ApiOperation({ summary: 'Update the details of an existing billing account.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'BA12345',
    required: true,
    description: 'The unique identifier of the billing account to be updated.',
  })
  @ApiBody({
    type: UpdateBillingAccountDto,
    required: true,
    description: 'Details of the billing account to be updated.',
  })
  @ApiResponse({
    type: BillingAccountDto,
    description: 'The updated billing account details.',
  })
  async updateBillingAccount(@Param('id') id: string, @Body() entity: UpdateBillingAccountDto): Promise<BillingAccountDto> {
    return this.updateBillingAccountUsecase.execute({ ...entity, id });
  }

  @Delete('billing-accounts/:id')
  @ApiOperation({ summary: 'Delete a specific billing account by its ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'BA12345',
    required: true,
    description: 'The unique identifier of the billing account to be deleted.',
  })
  @ApiResponse({
    type: BillingAccountDto,
    description: 'Details of the billing account that was deleted.',
  })
  async deleteBillingAccount(@Param('id') id: string): Promise<BillingAccountDto> {
    return this.deleteBillingAccountUsecase.execute(id);
  }
}
