import { Body, Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUserPreferences, UpdateUserPreferences } from '../../application';
import { USER_PREFERENCES_USECASE_PROVIDERS } from '../../domain';

import { UpdateUserPreferencesDto, UserPreferencesDto } from '../dtos';

@ApiTags('User Preferences') // Swagger tag for User Preferences APIs
@Controller('users')
export class UserPreferencesController {
  constructor(
    @Inject(USER_PREFERENCES_USECASE_PROVIDERS.GET_USER_PREFERENCES)
    private readonly getUserPreferencesUsecase: GetUserPreferences,

    @Inject(USER_PREFERENCES_USECASE_PROVIDERS.UPDATE_USER_PREFERENCES)
    private readonly updateUserPreferencesUsecase: UpdateUserPreferences,
  ) {}

  @Get(':id/preferences')
  @ApiOperation({ summary: 'Retrieve user preferences by user ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique ID of the user whose preferences are to be retrieved.',
  })
  @ApiResponse({
    type: UserPreferencesDto,
    description: 'User preferences for the specified user ID.',
  })
  async getUserPreferences(@Param('id') id: string): Promise<UserPreferencesDto> {
    return this.getUserPreferencesUsecase.execute(id);
  }

  @Put(':id/preferences')
  @ApiOperation({ summary: 'Update user preferences.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique ID of the user whose preferences are to be retrieved.',
  })
  @ApiBody({
    type: UpdateUserPreferencesDto,
    required: true,
    description: 'The user preferences data to update. Any optional fields not provided will remain unchanged.',
  })
  @ApiResponse({
    type: UserPreferencesDto,
    description: 'The updated user preferences.',
  })
  async updateUserPreferences(@Param('id') id: string, @Body() entity: UpdateUserPreferencesDto): Promise<UserPreferencesDto> {
    return this.updateUserPreferencesUsecase.execute({ ...entity, id });
  }
}
