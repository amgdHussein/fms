import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryFilter } from '../../../../core/queries';
import { GetLogs } from '../../application';
import { LOG_USECASE_PROVIDERS } from '../../domain';
import { LogDto } from '../dtos';

@ApiTags('Logs')
@Controller('logs')
export class LogController {
  constructor(
    @Inject(LOG_USECASE_PROVIDERS.GET_LOGS)
    private readonly getLogsUsecase: GetLogs,
  ) {}

  @Get()
  @ApiQuery({
    type: String,
    name: 'userId',
    required: false,
    description: 'The user ID to filter logs by a specific user.',
  })
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
    example: 10,
    description: 'The number of logs per page, for pagination. Defaults to 10 if not provided.',
  })
  @ApiOperation({ summary: 'Retrieve a paginated list of logs sorted by date.' })
  @ApiResponse({
    type: [LogDto],
    description: 'Returns a list of logs matching the provided filters, sorted by date.',
  })
  async getLogs(@Query('userId') userId: string, @Query('page') page: string, @Query('limit') limit: string): Promise<LogDto[]> {
    const filters: QueryFilter[] = [];

    if (userId) {
      filters.push({ key: 'userId', operator: 'eq', value: userId });
    }

    return this.getLogsUsecase.execute(filters, +page || 1, +limit || 10);
  }
}
