import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authority } from '../../../../core/common';

import { AddCodes, DraftCode, GetCode, GetCodes, ImportCodes, ReuseCode, UpdateCode } from '../../application';
import { CODE_USECASE_PROVIDERS } from '../../domain';
import { AddETACodesDto, CodeDto, DraftCodeDto, ReuseETACodeDto, UpdateETACodeDto } from '../dtos';

@ApiTags('Codes')
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

    @Inject(CODE_USECASE_PROVIDERS.REUSE_CODE)
    private readonly reuseCodeUsecase: ReuseCode,
  ) {}

  @Get('organizations/:id/codes/:codeId')
  @ApiOperation({ summary: 'Get Code by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the Code organization',
  })
  @ApiParam({
    name: 'codeId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the Code',
  })
  @ApiResponse({
    type: CodeDto,
    description: 'Code with specified id.',
  })
  async getCode(@Param('id') id: string, @Param('codeId') codeId: string): Promise<CodeDto> {
    return this.getCodeUsecase.execute(codeId, id);
  }

  @Get('organizations/:id/codes/')
  @ApiOperation({ summary: 'Get all active Codes for specific organization.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the Code organization',
  })
  @ApiResponse({
    type: Array<CodeDto>,
    description: 'List of active Codes for specific organization.',
  })
  async getCodes(@Param('id') id: string): Promise<CodeDto[]> {
    return this.getCodesUsecase.execute(id);
  }

  @Post('organizations/:id/codes/')
  @ApiOperation({ summary: 'Draft Code.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the Code organization',
  })
  @ApiBody({
    type: DraftCodeDto,
    required: true,
    description: 'Code info required to draft a new document into database.',
  })
  @ApiResponse({
    type: CodeDto,
    description: 'Code recently drafted.',
  })
  async draftCode(@Param('id') id: string, @Body() dto: DraftCodeDto): Promise<CodeDto> {
    return this.draftCodeUsecase.execute({ ...dto, organizationId: id });
  }

  // Authority Specific

  @Get('organizations/:id/eta')
  @ApiOperation({ summary: 'Get Code by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the organization',
  })
  @ApiParam({
    name: 'authority',
    type: String,
    example: 'eta',
    required: true,
    description: 'The authority to sync with.',
  })
  @ApiResponse({
    type: CodeDto,
    description: 'Code with specified id.',
  })
  async importCodes(@Param('id') id: string, @Param('authority') authority: Authority): Promise<CodeDto[]> {
    return this.importCodesUsecase.execute(authority, id);
  }

  // ETA Specific

  @Post('organizations/:id/eta/codes')
  @ApiOperation({ summary: 'Add ETA Codes.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the organization',
  })
  @ApiBody({
    type: AddETACodesDto,
    required: true,
    description: 'ETA codes to add to organization.',
  })
  @ApiResponse({
    type: Array<CodeDto>,
    description: 'List of added Codes for specific organization with authority.',
  })
  async addEtaCods(@Param('id') id: string, @Body() dto: AddETACodesDto): Promise<CodeDto[]> {
    return this.addCodesUsecase.execute(dto.codes, Authority.ETA, id);
  }

  @Put('organizations/:id/eta/codes')
  @ApiOperation({ summary: 'Update ETA Code.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the organization',
  })
  @ApiBody({
    type: UpdateETACodeDto,
    required: true,
    description: 'ETA code info to be updated.',
  })
  @ApiResponse({
    type: CodeDto,
    description: 'Code recently updated.',
  })
  async updateEtaCode(@Param('id') id: string, @Body() dto: UpdateETACodeDto): Promise<CodeDto> {
    return this.updateCodeUsecase.execute({ ...dto, organizationId: id, authority: Authority.ETA });
  }

  @Post('organizations/:id/eta/codes/reuse')
  @ApiOperation({ summary: 'Update ETA Code.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the organization',
  })
  @ApiBody({
    type: ReuseETACodeDto,
    required: true,
    description: 'ETA code info to be reused.',
  })
  @ApiResponse({
    type: CodeDto,
    description: 'Authority code to request reuse.',
  })
  async reuseEtaCode(@Param('id') id: string, @Body() dto: ReuseETACodeDto): Promise<CodeDto> {
    return this.reuseCodeUsecase.execute({ ...dto, organizationId: id, authority: Authority.ETA });
  }
}
