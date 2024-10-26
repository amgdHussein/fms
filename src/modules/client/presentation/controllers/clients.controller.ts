import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryDto, QueryResultDto } from '../../../../core/dtos';

import { AddClient, AddClients, DeleteClient, GetClient, QueryClients, UpdateClient } from '../../application';
import { CLIENT_USECASE_PROVIDERS } from '../../domain';

import { AddClientDto, AddClientsDto, ClientDto, UpdateClientDto } from '../dtos';

@ApiTags('Clients')
@Controller('clients')
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

    @Inject(CLIENT_USECASE_PROVIDERS.DELETE_CLIENT)
    private readonly deleteClientUsecase: DeleteClient,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get Client by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'the id of the client',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Client with specified id.',
  })
  async getClient(@Param('id') id: string): Promise<ClientDto> {
    return this.getClientUsecase.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all/N clients with/without filter the results.' })
  @ApiBody({
    type: QueryDto,
    required: false,
    description: 'Object contains List of query params are applied on the database, sort by field, as well as number of client needed.',
  })
  @ApiResponse({
    type: QueryResultDto<ClientDto>,
    description: 'List of clients that meet all the query filters, and with length less than or equal to limit number.',
  })
  async queryClients(@Query() query: QueryDto): Promise<QueryResultDto<ClientDto>> {
    const { page, limit, filters, order } = query;
    return this.queryClientsUsecase.execute(page, limit, filters, order);
  }

  @Post()
  @ApiOperation({ summary: 'Add new Client.' })
  @ApiBody({
    type: AddClientDto,
    required: true,
    description: 'Client info required to create a new document into database.',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Client recently added.',
  })
  async addClient(@Body() entity: AddClientDto): Promise<ClientDto> {
    return this.addClientUsecase.execute(entity);
  }

  @Post('/batch')
  @ApiBody({
    type: AddClientsDto,
    required: true,
    description: 'Clients info to be added.',
  })
  @ApiResponse({
    type: Array<ClientDto>,
    description: 'clients recently added.',
  })
  async addClients(@Body() dto: AddClientsDto): Promise<ClientDto[]> {
    return this.addClientsUsecase.execute(dto.clients);
  }

  @Put()
  @ApiOperation({ summary: 'Update client info.' })
  @ApiBody({
    type: UpdateClientDto,
    required: true,
    description: 'Optional client info to be updated.',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Updated client.',
  })
  async updateClient(@Body() entity: UpdateClientDto & { id: string }): Promise<ClientDto> {
    return this.updateClientUsecase.execute(entity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client by id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'Client id that required to delete the client data from database.',
  })
  @ApiResponse({
    type: ClientDto,
    description: 'Client deleted.',
  })
  async deleteClient(@Param('id') id: string): Promise<ClientDto> {
    return this.deleteClientUsecase.execute(id);
  }
}
