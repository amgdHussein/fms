import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationGuard } from '../../../../core/guards';

import { AddBranch, DeleteBranch, GetBranch, GetBranches, UpdateBranch } from '../../application';
import { BRANCH_USECASE_PROVIDERS } from '../../domain';

import { AddOrganizationBranchDto, OrganizationBranchDto, UpdateOrganizationBranchDto } from '../dtos';

@ApiTags('Branches')
@Controller()
@UseGuards(AuthenticationGuard)
export class OrganizationBranchController {
  constructor(
    @Inject(BRANCH_USECASE_PROVIDERS.GET_BRANCH)
    private readonly getBranchUsecase: GetBranch,

    @Inject(BRANCH_USECASE_PROVIDERS.ADD_BRANCH)
    private readonly addBranchUsecase: AddBranch,

    @Inject(BRANCH_USECASE_PROVIDERS.UPDATE_BRANCH)
    private readonly updateBranchUsecase: UpdateBranch,

    @Inject(BRANCH_USECASE_PROVIDERS.DELETE_BRANCH)
    private readonly deleteBranchUsecase: DeleteBranch,

    @Inject(BRANCH_USECASE_PROVIDERS.GET_BRANCHES)
    private readonly getOrganizationBranchesUsecase: GetBranches,
  ) {}

  @Get('branches/:id')
  @ApiOperation({ summary: 'Get organization branch by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the organization branch.',
  })
  @ApiResponse({
    type: OrganizationBranchDto,
    description: 'Branch with specified id.',
  })
  async getBranch(@Param('id') id: string): Promise<OrganizationBranchDto> {
    return this.getBranchUsecase.execute(id);
  }

  @Get('organizations/:id/branches')
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

  @Post('branches')
  @ApiOperation({ summary: 'Add new organization branch.' })
  @ApiBody({
    type: AddOrganizationBranchDto,
    required: true,
    description: 'Branch info required to create a new document into database.',
  })
  @ApiResponse({
    type: OrganizationBranchDto,
    description: 'Branch recently added.',
  })
  async addBranch(@Body() dto: AddOrganizationBranchDto): Promise<OrganizationBranchDto> {
    return this.addBranchUsecase.execute(dto);
  }

  @Put('branches')
  @ApiOperation({ summary: 'Update organization branch info.' })
  @ApiBody({
    type: UpdateOrganizationBranchDto,
    required: true,
    description: 'Optional organization branch info to be updated.',
  })
  @ApiResponse({
    type: OrganizationBranchDto,
    description: 'Updated organization branch.',
  })
  async updateBranch(@Body() entity: UpdateOrganizationBranchDto): Promise<OrganizationBranchDto> {
    return this.updateBranchUsecase.execute(entity);
  }

  @Delete('branches/:id')
  @ApiOperation({ summary: 'Delete organization branch by id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'Branch id that required to delete the organization branch data from database.',
  })
  @ApiResponse({
    type: OrganizationBranchDto,
    description: 'Branch deleted.',
  })
  async deleteBranch(@Param('id') id: string): Promise<OrganizationBranchDto> {
    return this.deleteBranchUsecase.execute(id);
  }
}
