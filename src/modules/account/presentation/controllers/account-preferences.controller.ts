import { Body, Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetAccountPreferences, UpdateAccountPreferences } from '../../application';
import { ACCOUNT_PREFERENCES_USECASE_PROVIDERS } from '../../domain';

import { AccountPreferencesDto, UpdateAccountPreferencesDto } from '../dtos';

@ApiTags('Account Preferences') // Tag for organizing account preferences-related endpoints
@Controller('accounts/preferences')
export class AccountPreferencesController {
  constructor(
    @Inject(ACCOUNT_PREFERENCES_USECASE_PROVIDERS.GET_ACCOUNT_PREFERENCES)
    private readonly getPreferencesUsecase: GetAccountPreferences,

    @Inject(ACCOUNT_PREFERENCES_USECASE_PROVIDERS.UPDATE_ACCOUNT_PREFERENCES)
    private readonly updatePreferencesUsecase: UpdateAccountPreferences,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve account preferences by account ID.' }) // Clear summary for getting preferences
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the account whose preferences are to be retrieved.',
  })
  @ApiResponse({
    type: AccountPreferencesDto,
    description: 'Returns the account preferences for the specified account ID.',
  })
  async getAccountPreferences(@Param('id') id: string): Promise<AccountPreferencesDto> {
    return this.getPreferencesUsecase.execute(id);
  }

  @Put()
  @ApiOperation({ summary: 'Update account preferences.' }) // Clear summary for updating preferences
  @ApiBody({
    type: UpdateAccountPreferencesDto,
    required: true,
    description: 'New values for the account preferences to be updated.',
  })
  @ApiResponse({
    type: AccountPreferencesDto,
    description: 'Returns the updated account preferences.',
  })
  async updateAccountPreferences(@Body() entity: UpdateAccountPreferencesDto): Promise<AccountPreferencesDto> {
    return this.updatePreferencesUsecase.execute(entity);
  }
}
