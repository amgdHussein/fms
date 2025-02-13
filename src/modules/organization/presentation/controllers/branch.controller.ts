import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AddBranches, DeleteBranch, GetBranch, GetBranches, UpdateBranch } from '../../application';
import { BRANCH_USECASE_PROVIDERS } from '../../domain';

import { AddOrganizationBranchesDto, OrganizationBranchDto, UpdateOrganizationBranchDto } from '../dtos';

@ApiTags('Branches')
@Controller()
export class OrganizationBranchController {
  constructor(
    @Inject(BRANCH_USECASE_PROVIDERS.GET_BRANCH)
    private readonly getBranchUsecase: GetBranch,

    @Inject(BRANCH_USECASE_PROVIDERS.ADD_BRANCHES)
    private readonly addBranchesUsecase: AddBranches,

    @Inject(BRANCH_USECASE_PROVIDERS.UPDATE_BRANCH)
    private readonly updateBranchUsecase: UpdateBranch,

    @Inject(BRANCH_USECASE_PROVIDERS.DELETE_BRANCH)
    private readonly deleteBranchUsecase: DeleteBranch,

    @Inject(BRANCH_USECASE_PROVIDERS.GET_BRANCHES)
    private readonly getOrganizationBranchesUsecase: GetBranches,
  ) {}

  @Get('branches/:id')
  @ApiOperation({ summary: 'Retrieve a specific branch by its ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'B12345',
    required: true,
    description: 'The unique identifier of the branch.',
  })
  @ApiResponse({
    type: OrganizationBranchDto,
    description: 'Details of the branch with the specified ID.',
  })
  async getBranch(@Param('id') id: string): Promise<OrganizationBranchDto> {
    return this.getBranchUsecase.execute(id);
  }

  @Post('branches')
  @ApiOperation({ summary: 'Create new organization branches.' })
  @ApiBody({
    type: AddOrganizationBranchesDto,
    required: true,
    description: 'Details required to create a list of branches.',
  })
  @ApiResponse({
    type: [OrganizationBranchDto],
    description: 'The newly created branches.',
  })
  async addBranch(@Body() dto: AddOrganizationBranchesDto): Promise<OrganizationBranchDto[]> {
    return this.addBranchesUsecase.execute(dto.branches);
  }

  @Put('branches/:id')
  @ApiOperation({ summary: 'Update the details of an existing branch.' })
  @ApiBody({
    type: UpdateOrganizationBranchDto,
    required: true,
    description: 'Details of the branch to be updated.',
  })
  @ApiResponse({
    type: OrganizationBranchDto,
    description: 'The updated branch details.',
  })
  async updateBranch(@Param('id') id: string, @Body() entity: UpdateOrganizationBranchDto): Promise<OrganizationBranchDto> {
    return this.updateBranchUsecase.execute({ ...entity, id });
  }

  @Delete('branches/:id')
  @ApiOperation({ summary: 'Delete a specific branch by its ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'B12345',
    required: true,
    description: 'The unique identifier of the branch to be deleted.',
  })
  @ApiResponse({
    type: OrganizationBranchDto,
    description: 'Details of the branch that was deleted.',
  })
  async deleteBranch(@Param('id') id: string): Promise<OrganizationBranchDto> {
    return this.deleteBranchUsecase.execute(id);
  }

  @Get('organizations/:organizationId/branches')
  @ApiOperation({ summary: 'Retrieve all branches associated with a specific organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiResponse({
    type: [OrganizationBranchDto],
    description: 'List of branches belonging to the organization.',
  })
  async getOrganizationBranches(@Param('organizationId') organizationId: string): Promise<OrganizationBranchDto[]> {
    return this.getOrganizationBranchesUsecase.execute(organizationId);
  }
}
