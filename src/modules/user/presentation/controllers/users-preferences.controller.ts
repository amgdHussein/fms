import { Body, Controller, Get, Inject, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationGuard } from '../../../../core/guards';

import { GetUserPreferences, UpdateUserPreferences } from '../../application';
import { USER_PREFERENCES_USECASE_PROVIDERS } from '../../domain';

import { UpdateUserPreferencesDto, UserPreferencesDto } from '../dtos';

@ApiTags('User Preferences')
@Controller('users/preferences')
@UseGuards(AuthenticationGuard)
export class UserPreferencesController {
  constructor(
    @Inject(USER_PREFERENCES_USECASE_PROVIDERS.GET_USER_PREFERENCES)
    private readonly getUserPreferencesUsecase: GetUserPreferences,

    @Inject(USER_PREFERENCES_USECASE_PROVIDERS.UPDATE_USER_PREFERENCES)
    private readonly updateUserPreferencesUsecase: UpdateUserPreferences,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user preferences by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'the id of the user',
  })
  @ApiResponse({
    type: UserPreferencesDto,
    description: 'User with specified id.',
  })
  async getUserPreferences(@Param('id') id: string): Promise<UserPreferencesDto> {
    return this.getUserPreferencesUsecase.execute(id);
  }

  @Put()
  @ApiOperation({ summary: 'Update user preferences data.' })
  @ApiBody({
    type: UpdateUserPreferencesDto,
    required: true,
    description: 'Optional user preferences to be updated.',
  })
  @ApiResponse({
    type: UserPreferencesDto,
    description: 'Updated user preferences.',
  })
  async updateUserPreferences(@Body() entity: UpdateUserPreferencesDto): Promise<UserPreferencesDto> {
    return this.updateUserPreferencesUsecase.execute(entity);
  }
}
