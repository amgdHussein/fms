import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationGuard } from '../../../../core/guards';

import { AddAccount, DeleteAccount, GetAccount, GetOrganizationAccounts, GetUserAccounts, UpdateAccount } from '../../application';
import { ACCOUNT_USECASE_PROVIDERS } from '../../domain';

import { AccountDto, AddAccountDto, UpdateAccountDto } from '../dtos';

@ApiTags('Accounts')
@Controller()
@UseGuards(AuthenticationGuard)
export class AccountController {
  constructor(
    @Inject(ACCOUNT_USECASE_PROVIDERS.GET_ACCOUNT)
    private readonly getAccountUsecase: GetAccount,

    @Inject(ACCOUNT_USECASE_PROVIDERS.ADD_ACCOUNT)
    private readonly addAccountUsecase: AddAccount,

    @Inject(ACCOUNT_USECASE_PROVIDERS.UPDATE_ACCOUNT)
    private readonly updateAccountUsecase: UpdateAccount,

    @Inject(ACCOUNT_USECASE_PROVIDERS.DELETE_ACCOUNT)
    private readonly deleteAccountUsecase: DeleteAccount,

    @Inject(ACCOUNT_USECASE_PROVIDERS.GET_ORGANIZATION_ACCOUNTS)
    private readonly getOrganizationAccountsUsecase: GetOrganizationAccounts,

    @Inject(ACCOUNT_USECASE_PROVIDERS.GET_USER_ACCOUNTS)
    private readonly getUserAccountsUsecase: GetUserAccounts,
  ) {}

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get Account by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the account',
  })
  @ApiResponse({
    type: AccountDto,
    description: 'Account with specified id.',
  })
  async getAccount(@Param('id') id: string): Promise<AccountDto> {
    return this.getAccountUsecase.execute(id);
  }

  @Get('organizations/:id/accounts')
  @ApiOperation({ summary: 'Get all accounts for specified organization system id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'System id that required to get accounts.',
  })
  @ApiResponse({
    type: Array<AccountDto>,
    description: 'List of organization accounts.',
  })
  async getOrganizationAccounts(@Param('id') id: string): Promise<AccountDto[]> {
    return this.getOrganizationAccountsUsecase.execute(id);
  }

  @Get('users:id/accounts')
  @ApiOperation({ summary: 'Get all accounts for specified user.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'User id that required to get accounts.',
  })
  @ApiResponse({
    type: Array<AccountDto>,
    description: 'List of user accounts.',
  })
  async getUserAccounts(@Param('id') id: string): Promise<AccountDto[]> {
    return this.getUserAccountsUsecase.execute(id);
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Add new Account.' })
  @ApiBody({
    type: AddAccountDto,
    required: true,
    description: 'Account info required to create a new document into database.',
  })
  @ApiResponse({
    type: AccountDto,
    description: 'Account recently added.',
  })
  async addAccount(@Body() entity: AddAccountDto): Promise<AccountDto> {
    return this.addAccountUsecase.execute(entity);
  }

  @Put('accounts')
  @ApiOperation({ summary: 'Update account info.' })
  @ApiBody({
    type: UpdateAccountDto,
    required: true,
    description: 'Optional account info to be updated.',
  })
  @ApiResponse({
    type: AccountDto,
    description: 'Updated account.',
  })
  async updateAccount(@Body() entity: UpdateAccountDto): Promise<AccountDto> {
    return this.updateAccountUsecase.execute(entity);
  }

  @Delete('accounts/:id')
  @ApiOperation({ summary: 'Delete account by id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'Account id that required to delete the account data from database.',
  })
  @ApiResponse({
    type: AccountDto,
    description: 'Account deleted.',
  })
  async deleteAccount(@Param('id') id: string): Promise<AccountDto> {
    return this.deleteAccountUsecase.execute(id);
  }
}
