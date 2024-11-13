import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryDto, QueryResultDto } from '../../../../core/dtos';

import { AddClient, AddClients, DeleteClient, GetClient, GetOrganizationClients, QueryClients, UpdateClient } from '../../application';
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

    @Inject(CLIENT_USECASE_PROVIDERS.QUERY_CLIENTS)
    private readonly queryClientsUsecase: QueryClients,

    @Inject(CLIENT_USECASE_PROVIDERS.QUERY_CLIENTS)
    private readonly getOrganizationClientsUsecase: GetOrganizationClients,

    @Inject(CLIENT_USECASE_PROVIDERS.DELETE_CLIENT)
    private readonly deleteClientUsecase: DeleteClient,
  ) {}

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

  @Post('clients/query')
  @ApiOperation({ summary: 'Retrieve all Clients or filter Clients based on criteria.' })
  @ApiBody({
    type: QueryDto,
    required: false,
    description: 'Query parameters to filter and paginate the results.',
  })
  @ApiResponse({
    type: QueryResultDto<ClientDto>,
    description: 'Returns a list of Clients that match the query filters.',
  })
  async queryClients(@Body() query: QueryDto): Promise<QueryResultDto<ClientDto>> {
    const { page, limit, filters, order } = query;
    return this.queryClientsUsecase.execute(page, limit, filters, order);
  }

  @Get('organizations/:systemId/clients')
  @ApiOperation({ summary: 'Retrieve all Clients for an organization.' })
  @ApiParam({
    name: 'systemId',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The unique identifier of the organization system.',
  })
  @ApiResponse({
    type: [ClientDto],
    description: 'Returns a list of Clients',
  })
  async getOrganizationClients(@Param('systemId') systemId: string): Promise<ClientDto[]> {
    return this.getOrganizationClientsUsecase.execute(systemId);
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

  @Post('clients/batch')
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

  @Put('clients')
  @ApiOperation({ summary: 'Update existing Client information.' })
  @ApiBody({
    type: UpdateClientDto,
    required: true,
    description: 'Information required to update an existing Client.',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Returns the updated Client.',
  })
  async updateClient(@Body() entity: UpdateClientDto & { id: string }): Promise<ClientDto> {
    return this.updateClientUsecase.execute(entity);
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
}
