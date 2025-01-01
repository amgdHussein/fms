import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AddClient, AddClients, DeleteClient, GetClient, GetClients, GetOrganizationClients, UpdateClient } from '../../application';
import { CLIENT_USECASE_PROVIDERS } from '../../domain';

import { AddClientDto, AddClientsDto, ClientDto, UpdateClientDto } from '../dtos';

@ApiTags('Clients')
@Controller()
export class ClientController {
  constructor(
    @Inject(CLIENT_USECASE_PROVIDERS.GET_CLIENT)
    private readonly getClientUsecase: GetClient,

    @Inject(CLIENT_USECASE_PROVIDERS.ADD_CLIENT)
    private readonly addClientUsecase: AddClient,

    @Inject(CLIENT_USECASE_PROVIDERS.ADD_CLIENTS)
    private readonly addClientsUsecase: AddClients,

    @Inject(CLIENT_USECASE_PROVIDERS.UPDATE_CLIENT)
    private readonly updateClientUsecase: UpdateClient,

    @Inject(CLIENT_USECASE_PROVIDERS.GET_CLIENTS)
    private readonly getClientsUsecase: GetClients,

    @Inject(CLIENT_USECASE_PROVIDERS.GET_ORGANIZATION_CLIENTS)
    private readonly getOrganizationClientsUsecase: GetOrganizationClients,

    @Inject(CLIENT_USECASE_PROVIDERS.DELETE_CLIENT)
    private readonly deleteClientUsecase: DeleteClient,
  ) {}

  @Get('clients')
  @ApiQuery({
    type: Number,
    name: 'page',
    required: false,
    example: 1,
    description: 'The page number to retrieve, for pagination. Defaults to 1 if not provided.',
  })
  @ApiQuery({
    type: Number,
    name: 'limit',
    required: false,
    example: 15,
    description: 'The number of staff per page, for pagination. Defaults to 15 if not provided.',
  })
  @ApiOperation({ summary: 'Retrieve all Clients or filter Clients based on criteria.' })
  @ApiResponse({
    type: [ClientDto],
    description: 'Returns a list of Clients that match the query filters.',
  })
  async getClients(@Query('page') page: string, @Query('limit') limit: string): Promise<ClientDto[]> {
    return this.getClientsUsecase.execute([], +page, +limit);
  }

  @Get('clients/:id')
  @ApiOperation({ summary: 'Retrieve a Client by ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the client.',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Returns the Client with the specified ID.',
  })
  async getClient(@Param('id') id: string): Promise<ClientDto> {
    return this.getClientUsecase.execute(id);
  }

  @Post('clients')
  @ApiOperation({ summary: 'Add a new Client.' })
  @ApiBody({
    type: AddClientDto,
    required: true,
    description: 'Information required to create a new Client.',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Returns the Client that was recently added.',
  })
  async addClient(@Body() entity: AddClientDto): Promise<ClientDto> {
    return this.addClientUsecase.execute(entity);
  }

  @Put('clients/:id')
  @ApiOperation({ summary: 'Update existing Client information.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the client.',
  })
  @ApiBody({
    type: UpdateClientDto,
    required: true,
    description: 'Information required to update an existing Client.',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Returns the updated Client.',
  })
  async updateClient(@Param('id') id: string, @Body() entity: UpdateClientDto): Promise<ClientDto> {
    return this.updateClientUsecase.execute({ ...entity, id });
  }

  @Delete('clients/:id')
  @ApiOperation({ summary: 'Delete a Client by ID.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The unique identifier of the Client to delete.',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Returns the deleted Client.',
  })
  async deleteClient(@Param('id') id: string): Promise<ClientDto> {
    return this.deleteClientUsecase.execute(id);
  }

  @Get('organizations/:organizationId/clients')
  @ApiOperation({ summary: 'Retrieve all Clients for an organization.' })
  @ApiParam({
    name: 'organizationId',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The unique identifier of the organization.',
  })
  @ApiResponse({
    type: [ClientDto],
    description: 'Returns a list of Clients',
  })
  async getOrganizationClients(@Param('organizationId') organizationId: string): Promise<ClientDto[]> {
    return this.getOrganizationClientsUsecase.execute(organizationId);
  }

  @Post('organizations/:organizationId/clients')
  @ApiOperation({ summary: 'Add multiple Clients in a batch.' })
  @ApiBody({
    type: AddClientsDto,
    required: true,
    description: 'Array of Clients to be added to the database.',
  })
  @ApiResponse({
    type: [ClientDto],
    description: 'Returns a list of Clients that were recently added.',
  })
  async addClients(@Body() dto: AddClientsDto): Promise<ClientDto[]> {
    return this.addClientsUsecase.execute(dto.clients);
  }
}
