import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationGuard } from '../../../../core/guards';

import { AddAccount, DeleteAccount, GetAccount, UpdateAccount } from '../../application';
import { ACCOUNT_USECASE_PROVIDERS } from '../../domain';

import { AccountDto, AddAccountDto, UpdateAccountDto } from '../dtos';

@ApiTags('Accounts')
@Controller('accounts')
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
  ) {}

  @Get(':id')
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

  @Post()
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

  @Put()
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

  @Delete(':id')
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
