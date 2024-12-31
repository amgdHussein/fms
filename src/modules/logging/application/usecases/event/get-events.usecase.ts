import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Event, IEventService, LOG_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetEvents implements Usecase<Event> {
  constructor(
    @Inject(LOG_SERVICE_PROVIDER)
    private readonly logService: IEventService,
  ) {}

  async execute(page = 1, limit = 10): Promise<Event[]> {
    return this.logService.getEvents([], page, limit);
  }
}
