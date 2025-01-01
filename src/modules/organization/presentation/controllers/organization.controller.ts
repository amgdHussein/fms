import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AddOrganization, DeleteOrganization, GetOrganization, GetOrganizations, UpdateOrganization } from '../../application';
import { ORGANIZATION_USECASE_PROVIDERS } from '../../domain';
import { AddOrganizationDto, OrganizationDto, UpdateOrganizationDto } from '../dtos';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(
    @Inject(ORGANIZATION_USECASE_PROVIDERS.GET_ORGANIZATION)
    private readonly getOrganizationUsecase: GetOrganization,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.ADD_ORGANIZATION)
    private readonly addOrganizationUsecase: AddOrganization,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.UPDATE_ORGANIZATION)
    private readonly updateOrganizationUsecase: UpdateOrganization,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.GET_ORGANIZATIONS)
    private readonly getOrganizationsUsecase: GetOrganizations,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.DELETE_ORGANIZATION)
    private readonly deleteOrganizationUsecase: DeleteOrganization,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve organizations with optional filters and pagination.' })
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
  @ApiResponse({
    type: [OrganizationDto],
    description: 'List of organizations matching the query parameters and pagination settings.',
  })
  async getOrganizations(@Query('page') page: string, @Query('limit') limit: string): Promise<OrganizationDto[]> {
    return this.getOrganizationsUsecase.execute([], +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an organization by its unique ID.' }) // Operation summary for fetching a specific organization
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiResponse({
    type: OrganizationDto,
    description: 'The organization with the specified ID.',
  })
  async getOrganization(@Param('id') id: string): Promise<OrganizationDto> {
    return this.getOrganizationUsecase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organization.' }) // Operation summary for adding a new organization
  @ApiBody({
    type: AddOrganizationDto,
    required: true,
    description: 'Details of the new organization to be created.',
  })
  @ApiResponse({
    type: OrganizationDto,
    description: 'The newly added organization.',
  })
  async addOrganization(@Body() dto: AddOrganizationDto): Promise<OrganizationDto> {
    return this.addOrganizationUsecase.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing organization.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiBody({
    type: UpdateOrganizationDto,
    required: true,
    description: 'Details of the organization to be updated.',
  })
  @ApiResponse({
    type: OrganizationDto,
    description: 'The updated organization details.',
  })
  async updateOrganization(@Param('id') id: string, @Body() entity: UpdateOrganizationDto): Promise<OrganizationDto> {
    return this.updateOrganizationUsecase.execute({ ...entity, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization by its unique ID.' }) // Operation summary for deleting an organization
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The unique identifier of the organization to be deleted.',
  })
  @ApiResponse({
    type: OrganizationDto,
    description: 'The details of the organization that was deleted.',
  })
  async deleteOrganization(@Param('id') id: string): Promise<OrganizationDto> {
    return this.deleteOrganizationUsecase.execute(id);
  }
}
