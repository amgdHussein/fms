import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AddAccount, DeleteAccount, GetAccount, GetOrganizationAccounts, GetUserAccounts, UpdateAccount } from '../../application';
import { ACCOUNT_USECASE_PROVIDERS } from '../../domain';

import { AccountDto, AddAccountDto, UpdateAccountDto } from '../dtos';

@ApiTags('Accounts')
@Controller()
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
  @ApiOperation({ summary: 'Retrieve an Account by ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the account.',
  })
  @ApiResponse({
    type: AccountDto,
    description: 'Returns the Account with the specified ID.',
  })
  async getAccount(@Param('id') id: string): Promise<AccountDto> {
    return this.getAccountUsecase.execute(id);
  }

  @Get('organizations/:id/accounts')
  @ApiOperation({ summary: 'Retrieve all accounts for a specified organization.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The organization ID to fetch associated accounts.',
  })
  @ApiResponse({
    type: Array<AccountDto>,
    description: 'Returns a list of accounts for the specified organization.',
  })
  async getOrganizationAccounts(@Param('id') id: string): Promise<AccountDto[]> {
    return this.getOrganizationAccountsUsecase.execute(id);
  }

  @Get('users/:id/accounts')
  @ApiOperation({ summary: 'Retrieve all accounts for a specified user.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The user ID to fetch associated accounts.',
  })
  @ApiResponse({
    type: Array<AccountDto>,
    description: 'Returns a list of accounts for the specified user.',
  })
  async getUserAccounts(@Param('id') id: string): Promise<AccountDto[]> {
    return this.getUserAccountsUsecase.execute(id);
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Add a new Account.' })
  @ApiBody({
    type: AddAccountDto,
    required: true,
    description: 'Information required to create a new account.',
  })
  @ApiResponse({
    type: AccountDto,
    description: 'Returns the Account that was recently added.',
  })
  async addAccount(@Body() entity: AddAccountDto): Promise<AccountDto> {
    return this.addAccountUsecase.execute(entity);
  }

  @Put('accounts')
  @ApiOperation({ summary: 'Update existing account information.' })
  @ApiBody({
    type: UpdateAccountDto,
    required: true,
    description: 'Information required to update an existing account.',
  })
  @ApiResponse({
    type: AccountDto,
    description: 'Returns the updated Account.',
  })
  async updateAccount(@Body() entity: UpdateAccountDto): Promise<AccountDto> {
    return this.updateAccountUsecase.execute(entity);
  }

  @Delete('accounts/:id')
  @ApiOperation({ summary: 'Delete an Account by ID.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The unique identifier of the Account to delete.',
  })
  @ApiResponse({
    type: AccountDto,
    description: 'Returns the deleted Account.',
  })
  async deleteAccount(@Param('id') id: string): Promise<AccountDto> {
    return this.deleteAccountUsecase.execute(id);
  }
}
