import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetEvents } from '../../application';
import { EVENT_USECASE_PROVIDERS } from '../../domain';
import { EventDto } from '../dtos';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(
    @Inject(EVENT_USECASE_PROVIDERS.GET_EVENTS)
    private readonly getEventsUsecase: GetEvents,
  ) {}

  @Get()
  @ApiQuery({
    type: Number,
    name: 'page',
    required: false,
    example: 1,
    description: 'The page number for pagination. Defaults to 1 if not specified.',
  })
  @ApiQuery({
    type: Number,
    name: 'limit',
    required: false,
    example: 10,
    description: 'The number of events per page. Defaults to 10 if not specified.',
  })
  @ApiOperation({ summary: 'Retrieve a paginated and sorted list of events.' })
  @ApiResponse({
    type: [EventDto],
    description: 'Returns a paginated list of events, sorted by date.',
  })
  async getEvents(@Query('page') page: string, @Query('limit') limit: string): Promise<EventDto[]> {
    return this.getEventsUsecase.execute(+page, +limit);
  }
}
