import { Body, Controller, Get, Inject, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationGuard } from '../../../../core/guards';

import { GetAccountPreferences, UpdateAccountPreferences } from '../../application';
import { ACCOUNT_PREFERENCES_USECASE_PROVIDERS } from '../../domain';

import { AccountPreferencesDto, UpdateAccountPreferencesDto } from '../dtos';

@ApiTags('Account Preferences')
@Controller('accounts/preferences')
@UseGuards(AuthenticationGuard)
export class AccountPreferencesController {
  constructor(
    @Inject(ACCOUNT_PREFERENCES_USECASE_PROVIDERS.GET_ACCOUNT_PREFERENCES)
    private readonly getPreferencesUsecase: GetAccountPreferences,

    @Inject(ACCOUNT_PREFERENCES_USECASE_PROVIDERS.UPDATE_ACCOUNT_PREFERENCES)
    private readonly updatePreferencesUsecase: UpdateAccountPreferences,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get account preferences by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'the id of the account',
  })
  @ApiResponse({
    type: AccountPreferencesDto,
    description: 'Account with specified id.',
  })
  async getAccountPreferences(@Param('id') id: string): Promise<AccountPreferencesDto> {
    return this.getPreferencesUsecase.execute(id);
  }

  @Put()
  @ApiOperation({ summary: 'Update account preferences data.' })
  @ApiBody({
    type: UpdateAccountPreferencesDto,
    required: true,
    description: 'Optional account preferences to be updated.',
  })
  @ApiResponse({
    type: AccountPreferencesDto,
    description: 'Updated account preferences.',
  })
  async updateAccountPreferences(@Body() entity: UpdateAccountPreferencesDto): Promise<AccountPreferencesDto> {
    return this.updatePreferencesUsecase.execute(entity);
  }
}
