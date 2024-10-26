import { Body, Controller, Get, Inject, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationGuard } from '../../../../core/guards';

import { GetOrganizationPreferences, UpdateOrganizationPreferences } from '../../application';
import { ORGANIZATION_PREFERENCES_USECASE_PROVIDERS } from '../../domain';

import { OrganizationPreferencesDto, UpdateOrganizationPreferencesDto } from '../dtos';

@ApiTags('Organization Preferences')
@Controller('organizations/preferences')
@UseGuards(AuthenticationGuard)
export class OrganizationPreferencesController {
  constructor(
    @Inject(ORGANIZATION_PREFERENCES_USECASE_PROVIDERS.GET_ORGANIZATION_PREFERENCES)
    private readonly getPreferencesUsecase: GetOrganizationPreferences,

    @Inject(ORGANIZATION_PREFERENCES_USECASE_PROVIDERS.UPDATE_ORGANIZATION_PREFERENCES)
    private readonly updatePreferencesUsecase: UpdateOrganizationPreferences,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get organization preferences by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'the id of the organization',
  })
  @ApiResponse({
    type: OrganizationPreferencesDto,
    description: 'Organization with specified id.',
  })
  async getOrganizationPreferences(@Param('id') id: string): Promise<OrganizationPreferencesDto> {
    return this.getPreferencesUsecase.execute(id);
  }

  @Put()
  @ApiOperation({ summary: 'Update organization preferences data.' })
  @ApiBody({
    type: UpdateOrganizationPreferencesDto,
    required: true,
    description: 'Optional organization preferences to be updated.',
  })
  @ApiResponse({
    type: OrganizationPreferencesDto,
    description: 'Updated organization preferences.',
  })
  async updateOrganizationPreferences(@Body() dto: UpdateOrganizationPreferencesDto): Promise<OrganizationPreferencesDto> {
    return this.updatePreferencesUsecase.execute(dto);
  }
}
