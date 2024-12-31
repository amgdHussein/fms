import { Inject, Injectable } from '@nestjs/common';
import { QueryFilter } from '../../../../core/models';

import { Event, EVENT_REPOSITORY_PROVIDER, EventDetails, EventStatus, EventTask, IEventRepository, IEventService } from '../../domain';

@Injectable()
export class EventService implements IEventService {
  constructor(
    @Inject(EVENT_REPOSITORY_PROVIDER)
    private readonly eventRepo: IEventRepository,
  ) {}

  async getEvents(filters?: QueryFilter[], page?: number, limit?: number): Promise<Event[]> {
    return this.eventRepo.getMany(filters, page, limit);
  }

  async getEvent(id: string): Promise<Event> {
    return this.eventRepo.get(id);
  }

  async addEvent(message: string, task: EventTask, status: EventStatus, details: EventDetails, searchTerms: string[]): Promise<Event> {
    return this.eventRepo.add({
      message,
      task,
      status,
      details,
      searchTerms,
    });
  }

  async updateEvent(invoice: Partial<Event> & { id: string }): Promise<Event> {
    return this.eventRepo.update(invoice);
  }

  async deleteEvent(id: string): Promise<Event> {
    return this.eventRepo.delete(id);
  }
}
