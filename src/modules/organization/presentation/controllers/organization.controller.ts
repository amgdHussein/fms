import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryDto, QueryResultDto } from '../../../../core/dtos';
import { AuthenticationGuard } from '../../../../core/guards';

import {
  AddOrganization,
  DeleteOrganization,
  GetBranches,
  GetOrganization,
  GetOrganizationAccounts,
  QueryOrganizations,
  UpdateOrganization,
} from '../../application';
import { BRANCH_USECASE_PROVIDERS, ORGANIZATION_USECASE_PROVIDERS } from '../../domain';

import { AccountDto } from '../../../account/presentation';
import { AddOrganizationDto, OrganizationBranchDto, OrganizationDto, UpdateOrganizationDto } from '../dtos';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(AuthenticationGuard)
export class OrganizationController {
  constructor(
    @Inject(ORGANIZATION_USECASE_PROVIDERS.GET_ORGANIZATION)
    private readonly getOrganizationUsecase: GetOrganization,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.ADD_ORGANIZATION)
    private readonly addOrganizationUsecase: AddOrganization,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.UPDATE_ORGANIZATION)
    private readonly updateOrganizationUsecase: UpdateOrganization,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.QUERY_ORGANIZATIONS)
    private readonly queryOrganizationsUsecase: QueryOrganizations,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.DELETE_ORGANIZATION)
    private readonly deleteOrganizationUsecase: DeleteOrganization,

    @Inject(BRANCH_USECASE_PROVIDERS.GET_BRANCHES)
    private readonly getOrganizationBranchesUsecase: GetBranches,

    @Inject(ORGANIZATION_USECASE_PROVIDERS.GET_ORGANIZATION_ACCOUNTS)
    private readonly getOrganizationAccountsUsecase: GetOrganizationAccounts,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all/N organizations with/without filter the results.' })
  @ApiBody({
    type: QueryDto,
    required: false,
    description: 'Object contains List of query params are applied on the database, sort by field, as well as number of organization needed.',
  })
  @ApiResponse({
    type: QueryResultDto<OrganizationDto>,
    description: 'List of organizations that meet all the query filters, and with length less than or equal to limit number.',
  })
  async queryOrganizations(@Query() query: QueryDto): Promise<QueryResultDto<OrganizationDto>> {
    const { page, limit, filters, order } = query;
    return this.queryOrganizationsUsecase.execute(page, limit, filters, order);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the organization',
  })
  @ApiResponse({
    type: OrganizationDto,
    description: 'Organization with specified id.',
  })
  async getOrganization(@Param('id') id: string): Promise<OrganizationDto> {
    return this.getOrganizationUsecase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add new organization.' })
  @ApiBody({
    type: AddOrganizationDto,
    required: true,
    description: 'Organization info required to create a new document into database.',
  })
  @ApiResponse({
    type: OrganizationDto,
    description: 'Organization recently added.',
  })
  async addOrganization(@Body() dto: AddOrganizationDto): Promise<OrganizationDto> {
    return this.addOrganizationUsecase.execute(dto);
  }

  @Put()
  @ApiOperation({ summary: 'Update organization info.' })
  @ApiBody({
    type: UpdateOrganizationDto,
    required: true,
    description: 'Optional organization info to be updated.',
  })
  @ApiResponse({
    type: OrganizationDto,
    description: 'Updated organization.',
  })
  async updateOrganization(@Body() entity: UpdateOrganizationDto): Promise<OrganizationDto> {
    return this.updateOrganizationUsecase.execute(entity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization by id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'Organization id that required to delete the organization data from database.',
  })
  @ApiResponse({
    type: OrganizationDto,
    description: 'Organization deleted.',
  })
  async deleteOrganization(@Param('id') id: string): Promise<OrganizationDto> {
    return this.deleteOrganizationUsecase.execute(id);
  }

  @Get(':id/branches')
  @ApiOperation({ summary: 'Get all branches for an organization.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'Organization system id that required to delete the organization data from database.',
  })
  @ApiResponse({
    type: Array<OrganizationBranchDto>,
    description: 'List of branches.',
  })
  async getOrganizationBranches(@Param('id') id: string): Promise<OrganizationBranchDto[]> {
    return this.getOrganizationBranchesUsecase.execute(id);
  }

  @Get(':id/accounts')
  @ApiOperation({ summary: 'Get all accounts for specified organization system id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'System id that required to get accounts.',
  })
  @ApiResponse({
    type: Array<AccountDto>,
    description: 'List of organization accounts.',
  })
  async getUserAccounts(@Param('id') id: string): Promise<AccountDto[]> {
    return this.getOrganizationAccountsUsecase.execute(id);
  }
}
