import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DraftCode, GetCode, GetCodes } from '../../application';
import { CODE_USECASE_PROVIDERS } from '../../domain';
import { CodeDto, DraftCodeDto } from '../dtos';

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
  ) {}

  @Get('organizations/:organizationId/codes/:codeId')
  @ApiOperation({ summary: 'Retrieve a specific Code by its ID.' }) // Clear summary for getting a code
  @ApiParam({
    name: 'organizationId',
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
  async getCode(@Param('organizationId') organizationId: string, @Param('codeId') codeId: string): Promise<CodeDto> {
    return this.getCodeUsecase.execute(codeId, organizationId);
  }

  //TODO: ADD FILTER AND PAGINATION
  @Get('organizations/:organizationId/codes')
  @ApiOperation({ summary: 'Retrieve all active Codes for a specific organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'ID of the Code organization.',
  })
  @ApiResponse({
    type: [CodeDto],
    description: 'List of active Codes for the specified organization.',
  })
  async getCodes(@Param('organizationId') organizationId: string): Promise<CodeDto[]> {
    return this.getCodesUsecase.execute(organizationId);
  }

  @Post('organizations/:organizationId/codes/')
  @ApiOperation({ summary: 'Draft a new Code.' })
  @ApiParam({
    name: 'organizationId',
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
  async draftCode(@Param('organizationId') organizationId: string, @Body() dto: DraftCodeDto): Promise<CodeDto> {
    return this.draftCodeUsecase.execute({ ...dto, organizationId });
  }
}
