import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Authority } from '../../../../core/common';
import { AssignOrganizationTax, GetOrganizationTax, UpdateOrganizationTax, ValidateAuthorityTaxNumber } from '../../application';
import { ORGANIZATION_TAX_USECASE_PROVIDERS } from '../../domain';
import { AssignOrganizationTaxDto, OrganizationTaxDto, UpdateOrganizationTaxDto } from '../dtos';

@ApiTags('Organization Tax')
@Controller()
export class OrganizationTaxController {
  constructor(
    @Inject(ORGANIZATION_TAX_USECASE_PROVIDERS.GET_ORGANIZATION_TAX)
    private readonly getOrganizationTaxUsecase: GetOrganizationTax,

    @Inject(ORGANIZATION_TAX_USECASE_PROVIDERS.VALIDATE_AUTHORITY_TAX_NUMBER)
    private readonly validateAuthorityTaxNumberUsecase: ValidateAuthorityTaxNumber,

    @Inject(ORGANIZATION_TAX_USECASE_PROVIDERS.ASSIGN_ORGANIZATION_TAX)
    private readonly assignOrganizationTaxUsecase: AssignOrganizationTax,

    @Inject(ORGANIZATION_TAX_USECASE_PROVIDERS.UPDATE_ORGANIZATION_TAX)
    private readonly updateOrganizationTaxUsecase: UpdateOrganizationTax,
  ) {}

  @Get('organizations/:organizationId/tax')
  @ApiOperation({ summary: 'Get organization tax' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the organization.',
  })
  @ApiResponse({
    type: OrganizationTaxDto,
    description: 'The organization tax.',
  })
  async getOrganizationTax(@Param('organizationId') organizationId: string): Promise<OrganizationTaxDto> {
    return this.getOrganizationTaxUsecase.execute(organizationId);
  }

  @Get(':authority/tax/:taxIdNo')
  @ApiOperation({ summary: 'Validate if authority already has an organization tax with provided tax id number.' })
  @ApiParam({
    name: 'authority',
    type: String,
    example: 'eta',
    required: true,
    description: 'The authority to sync Codes with.',
  })
  @ApiParam({
    name: 'taxIdNo',
    type: String,
    example: '15849452',
    required: true,
    description: 'Tax id of the organization.',
  })
  @ApiResponse({
    type: OrganizationTaxDto,
    description: 'The organization tax.',
  })
  async getOrganizationByTaxId(@Param('authority') authority: Authority, @Param('taxIdNo') taxIdNo: string): Promise<OrganizationTaxDto> {
    return await this.validateAuthorityTaxNumberUsecase.execute(taxIdNo, authority);
  }

  @Post('organizations/:organizationId/tax')
  @ApiOperation({ summary: 'Assign organization tax with authority (can not be reassigned).' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiBody({
    type: AssignOrganizationTaxDto,
    required: true,
    description: 'The organization tax.',
  })
  @ApiResponse({
    type: OrganizationTaxDto,
    description: 'The newly created organization tax.',
  })
  async addOrganizationTax(@Param('organizationId') organizationId: string, @Body() dto: AssignOrganizationTaxDto): Promise<OrganizationTaxDto> {
    return await this.assignOrganizationTaxUsecase.execute({ ...dto, organizationId });
  }

  @Put('organizations/:organizationId/tax')
  @ApiOperation({ summary: 'Update organization tax' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
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
  async updateOrganizationTax(@Param('organizationId') organizationId: string, @Body() dto: UpdateOrganizationTaxDto): Promise<OrganizationTaxDto> {
    return this.updateOrganizationTaxUsecase.execute({ ...dto, id: organizationId });
  }
}
