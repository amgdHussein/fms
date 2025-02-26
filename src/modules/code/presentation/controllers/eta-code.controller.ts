import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authority } from '../../../../core/enums';

import { AddCodes, ImportCodes, ReuseCodes, UpdateCode } from '../../application';
import { ETA_CODE_USECASE_PROVIDERS } from '../../domain';
import { AddETACodesDto, CodeDto, ReuseETACodesDto, UpdateETACodeDto } from '../dtos';

@ApiTags('ETA Codes')
@Controller()
export class EtaCodeController {
  constructor(
    @Inject(ETA_CODE_USECASE_PROVIDERS.IMPORT_CODES)
    private readonly importCodesUsecase: ImportCodes,

    @Inject(ETA_CODE_USECASE_PROVIDERS.ADD_CODES)
    private readonly addCodesUsecase: AddCodes,

    @Inject(ETA_CODE_USECASE_PROVIDERS.UPDATE_CODE)
    private readonly updateCodeUsecase: UpdateCode,

    @Inject(ETA_CODE_USECASE_PROVIDERS.REUSE_CODES)
    private readonly reuseCodeUsecase: ReuseCodes,
  ) {}

  @Get('organizations/:organizationId/codes/eta')
  @ApiOperation({ summary: 'Import Codes from an external authority.' })
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
    type: [CodeDto],
    description: 'List of Codes imported from the specified authority.',
  })
  async importCodes(@Param('organizationId') organizationId: string, @Param('authority') authority: Authority): Promise<CodeDto[]> {
    return this.importCodesUsecase.execute(authority, organizationId);
  }

  @Post('organizations/:organizationId/codes/eta')
  @ApiOperation({ summary: 'Add ETA-specific Codes.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the organization.',
  })
  @ApiBody({
    type: AddETACodesDto,
    required: true,
    description: 'Data of ETA Codes to be added to the organization.',
  })
  @ApiResponse({
    type: [CodeDto],
    description: 'Returns a list of added ETA Codes for the specified organization.',
  })
  async addEtaCodes(@Param('organizationId') organizationId: string, @Body() dto: AddETACodesDto): Promise<CodeDto[]> {
    return this.addCodesUsecase.execute(dto.codes, Authority.ETA, organizationId);
  }

  @Put('organizations/:organizationId/codes/:codeId/eta')
  @ApiOperation({ summary: 'Update an existing ETA-specific Code.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the organization.',
  })
  @ApiParam({
    name: 'codeId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the ETA Code to be updated.',
  })
  @ApiBody({
    type: UpdateETACodeDto,
    required: true,
    description: 'Data of the ETA Code to be updated.',
  })
  @ApiResponse({
    type: CodeDto,
    description: 'Returns the updated ETA Code.',
  })
  async updateEtaCode(@Param('organizationId') organizationId: string, @Param('codeId') codeId: string, @Body() dto: UpdateETACodeDto): Promise<CodeDto> {
    return this.updateCodeUsecase.execute({ ...dto, id: codeId, organizationId, authority: Authority.ETA });
  }

  @Post('organizations/:organizationId/codes/reuse/eta')
  @ApiOperation({ summary: 'Reuse an existing ETA Code.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the organization.',
  })
  @ApiBody({
    type: ReuseETACodesDto,
    required: true,
    description: 'Data of the ETA Code to be reused.',
  })
  @ApiResponse({
    type: [CodeDto],
    description: 'Returns the reused ETA Codes.',
  })
  async reuseEtaCode(@Param('organizationId') organizationId: string, @Body() dto: ReuseETACodesDto): Promise<CodeDto[]> {
    return this.reuseCodeUsecase.execute(dto.codes, Authority.ETA, organizationId);
  }
}
