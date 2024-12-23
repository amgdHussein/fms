import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authority } from '../../../../core/common';

import { AddCodes, DraftCode, GetCode, GetCodes, ImportCodes, ReuseCodes, UpdateCode } from '../../application';
import { CODE_USECASE_PROVIDERS } from '../../domain';
import { AddETACodesDto, CodeDto, DraftCodeDto, ReuseETACodesDto, UpdateETACodeDto } from '../dtos';

@ApiTags('Codes') // Tag for grouping code-related endpoints
@Controller()
export class CodeController {
  constructor(
    @Inject(CODE_USECASE_PROVIDERS.GET_CODE)
    private readonly getCodeUsecase: GetCode,

    @Inject(CODE_USECASE_PROVIDERS.GET_CODES)
    private readonly getCodesUsecase: GetCodes,

    @Inject(CODE_USECASE_PROVIDERS.DRAFT_CODE)
    private readonly draftCodeUsecase: DraftCode,

    @Inject(CODE_USECASE_PROVIDERS.IMPORT_CODES)
    private readonly importCodesUsecase: ImportCodes,

    @Inject(CODE_USECASE_PROVIDERS.ADD_CODES)
    private readonly addCodesUsecase: AddCodes,

    @Inject(CODE_USECASE_PROVIDERS.UPDATE_CODE)
    private readonly updateCodeUsecase: UpdateCode,

    @Inject(CODE_USECASE_PROVIDERS.REUSE_CODES)
    private readonly reuseCodeUsecase: ReuseCodes,
  ) {}

  @Get('organizations/:id/codes/:codeId')
  @ApiOperation({ summary: 'Retrieve a specific Code by its ID.' }) // Clear summary for getting a code
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the Code organization.',
  })
  @ApiParam({
    name: 'codeId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the specific Code to retrieve.',
  })
  @ApiResponse({
    type: CodeDto,
    description: 'Returns the Code with the specified ID.',
  })
  async getCode(@Param('id') id: string, @Param('codeId') codeId: string): Promise<CodeDto> {
    return this.getCodeUsecase.execute(codeId, id);
  }

  @Get('organizations/:id/codes')
  @ApiOperation({ summary: 'Retrieve all active Codes for a specific organization.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the Code organization.',
  })
  @ApiResponse({
    type: [CodeDto],
    description: 'List of active Codes for the specified organization.',
  })
  async getCodes(@Param('id') id: string): Promise<CodeDto[]> {
    return this.getCodesUsecase.execute(id);
  }

  @Post('organizations/:id/codes/')
  @ApiOperation({ summary: 'Draft a new Code.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the Code organization.',
  })
  @ApiBody({
    type: DraftCodeDto,
    required: true,
    description: 'Data required to draft a new Code.',
  })
  @ApiResponse({
    type: CodeDto,
    description: 'Returns the recently drafted Code.',
  })
  async draftCode(@Param('id') id: string, @Body() dto: DraftCodeDto): Promise<CodeDto> {
    return this.draftCodeUsecase.execute({ ...dto, organizationId: id });
  }

  // Authority Specific

  @Get('organizations/:id/eta')
  @ApiOperation({ summary: 'Import Codes from an external authority.' })
  @ApiParam({
    name: 'id',
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
  async importCodes(@Param('id') id: string, @Param('authority') authority: Authority): Promise<CodeDto[]> {
    return this.importCodesUsecase.execute(authority, id);
  }

  // ETA Specific

  @Post('organizations/:id/eta/codes')
  @ApiOperation({ summary: 'Add ETA-specific Codes.' })
  @ApiParam({
    name: 'id',
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
  async addEtaCodes(@Param('id') id: string, @Body() dto: AddETACodesDto): Promise<CodeDto[]> {
    return this.addCodesUsecase.execute(dto.codes, Authority.ETA, id);
  }

  @Put('organizations/:id/eta/codes')
  @ApiOperation({ summary: 'Update an existing ETA-specific Code.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the organization.',
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
  async updateEtaCode(@Param('id') id: string, @Body() dto: UpdateETACodeDto): Promise<CodeDto> {
    return this.updateCodeUsecase.execute({ ...dto, organizationId: id, authority: Authority.ETA });
  }

  @Post('organizations/:id/eta/codes/reuse')
  @ApiOperation({ summary: 'Reuse an existing ETA Code.' })
  @ApiParam({
    name: 'id',
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
  async reuseEtaCode(@Param('id') id: string, @Body() dto: ReuseETACodesDto): Promise<CodeDto[]> {
    return this.reuseCodeUsecase.execute(dto.codes, Authority.ETA, id);
  }
}
