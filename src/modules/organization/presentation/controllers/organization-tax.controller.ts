import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Authority } from '../../../../core/common';

import { AddOrganizationTax, GetOrganizationTax, UpdateOrganizationTax } from '../../application';
import { ORGANIZATION_TAX_USECASE_PROVIDERS } from '../../domain';
import { AddOrganizationTaxDto, OrganizationTaxDto, UpdateOrganizationTaxDto } from '../dtos';

@ApiTags('Organization Tax')
@Controller('organizations')
export class OrganizationTaxController {
  constructor(
    @Inject(ORGANIZATION_TAX_USECASE_PROVIDERS.GET_ORGANIZATION_TAX)
    private readonly getOrganizationTaxUsecase: GetOrganizationTax,

    @Inject(ORGANIZATION_TAX_USECASE_PROVIDERS.ADD_ORGANIZATION_TAX)
    private readonly addOrganizationTaxUsecase: AddOrganizationTax,

    @Inject(ORGANIZATION_TAX_USECASE_PROVIDERS.UPDATE_ORGANIZATION_TAX)
    private readonly updateOrganizationTaxUsecase: UpdateOrganizationTax,
  ) {}

  @Get(':organizationId/:authority')
  @ApiOperation({ summary: 'Get organization tax' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the organization.',
  })
  @ApiParam({
    name: 'authority',
    type: String,
    example: 'eta',
    required: true,
    description: 'The authority to sync Codes with.',
  })
  @ApiResponse({
    type: OrganizationTaxDto,
    description: 'The organization tax.',
  })
  async getOrganizationTax(@Param('organizationId') organizationId: string, @Param('authority') authority: Authority): Promise<OrganizationTaxDto> {
    return this.getOrganizationTaxUsecase.execute(organizationId, authority);
  }

  // TODO: CAN NOT ADD SAME AUTHORITY TWICE
  @Post(':organizationId/:authority')
  @ApiOperation({ summary: 'Add organization tax' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiParam({
    name: 'authority',
    type: String,
    example: 'eta',
    required: true,
    description: 'The authority to sync Codes with.',
  })
  @ApiBody({
    type: AddOrganizationTaxDto,
    required: true,
    description: 'The organization tax.',
  })
  @ApiResponse({
    type: OrganizationTaxDto,
    description: 'The newly created organization tax.',
  })
  async addOrganizationTax(
    @Param('organizationId') organizationId: string,
    @Param('authority') authority: Authority,
    @Body() dto: AddOrganizationTaxDto,
  ): Promise<OrganizationTaxDto> {
    return this.addOrganizationTaxUsecase.execute({ ...dto, organizationId, authority });
  }

  @Put(':organizationId/:authority')
  @ApiOperation({ summary: 'Update organization tax' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiParam({
    name: 'authority',
    type: String,
    example: 'eta',
    required: true,
    description: 'The authority to sync Codes with.',
  })
  @ApiBody({
    type: UpdateOrganizationTaxDto,
    required: true,
    description: 'The organization tax.',
  })
  @ApiResponse({
    type: OrganizationTaxDto,
    description: 'The newly created organization tax.',
  })
  async updateOrganization(
    @Param('organizationId') organizationId: string,
    @Param('authority') authority: Authority,
    @Body() dto: UpdateOrganizationTaxDto,
  ): Promise<OrganizationTaxDto> {
    return this.updateOrganizationTaxUsecase.execute(dto, organizationId, authority);
  }
}
