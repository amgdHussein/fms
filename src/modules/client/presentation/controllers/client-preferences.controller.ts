import { Body, Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetClientPreferences, UpdateClientPreferences } from '../../application';
import { CLIENT_PREFERENCES_USECASE_PROVIDERS } from '../../domain';

import { ClientPreferencesDto, UpdateClientPreferencesDto } from '../dtos';

@ApiTags('Client Preferences')
@Controller('clients/preferences')
export class ClientPreferencesController {
  constructor(
    @Inject(CLIENT_PREFERENCES_USECASE_PROVIDERS.GET_CLIENT_PREFERENCES)
    private readonly getPreferencesUsecase: GetClientPreferences,

    @Inject(CLIENT_PREFERENCES_USECASE_PROVIDERS.UPDATE_CLIENT_PREFERENCES)
    private readonly updatePreferencesUsecase: UpdateClientPreferences,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve client preferences by ID.' }) // Operation summary
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the client.',
  })
  @ApiResponse({
    type: ClientPreferencesDto,
    description: 'Details of the client preferences with the specified ID.',
  })
  async getClientPreferences(@Param('id') id: string): Promise<ClientPreferencesDto> {
    return this.getPreferencesUsecase.execute(id);
  }

  @Put()
  @ApiOperation({ summary: 'Update client preferences.' }) // Operation summary
  @ApiBody({
    type: UpdateClientPreferencesDto,
    required: true,
    description: 'Details of the client preferences to be updated.',
  })
  @ApiResponse({
    type: ClientPreferencesDto,
    description: 'The updated client preferences.',
  })
  async updateClientPreferences(@Body() dto: UpdateClientPreferencesDto): Promise<ClientPreferencesDto> {
    return this.updatePreferencesUsecase.execute(dto);
  }
}
