import { Body, Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetOrganizationPreferences, UpdateOrganizationPreferences } from '../../application';
import { ORGANIZATION_PREFERENCES_USECASE_PROVIDERS } from '../../domain';

import { OrganizationPreferencesDto, UpdateOrganizationPreferencesDto } from '../dtos';

@ApiTags('Organization Preferences')
@Controller('organizations')
export class OrganizationPreferencesController {
  constructor(
    @Inject(ORGANIZATION_PREFERENCES_USECASE_PROVIDERS.GET_ORGANIZATION_PREFERENCES)
    private readonly getPreferencesUsecase: GetOrganizationPreferences,

    @Inject(ORGANIZATION_PREFERENCES_USECASE_PROVIDERS.UPDATE_ORGANIZATION_PREFERENCES)
    private readonly updatePreferencesUsecase: UpdateOrganizationPreferences,
  ) {}

  @Get(':id/preferences')
  @ApiOperation({ summary: 'Retrieve organization preferences by ID.' }) // Operation summary
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiResponse({
    type: OrganizationPreferencesDto,
    description: 'Details of the organization preferences with the specified ID.',
  })
  async getOrganizationPreferences(@Param('id') id: string): Promise<OrganizationPreferencesDto> {
    return this.getPreferencesUsecase.execute(id);
  }

  @Put(':id/preferences')
  @ApiOperation({ summary: 'Update organization preferences.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiBody({
    type: UpdateOrganizationPreferencesDto,
    required: true,
    description: 'Details of the organization preferences to be updated.',
  })
  @ApiResponse({
    type: OrganizationPreferencesDto,
    description: 'The updated organization preferences.',
  })
  async updateOrganizationPreferences(@Param('id') id: string, @Body() dto: UpdateOrganizationPreferencesDto): Promise<OrganizationPreferencesDto> {
    return this.updatePreferencesUsecase.execute({ ...dto, id });
  }
}
