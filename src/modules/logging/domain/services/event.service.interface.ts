import { QueryFilter } from '../../../../core/queries';
import { Event, EventStatus, EventTask } from '../entities';

export type EventDetails = Record<string, string | number | object>;

export interface IEventService {
  getEvents(filters?: QueryFilter[], page?: number, limit?: number): Promise<Event[]>;
  getEvent(id: string): Promise<Event>;
  addEvent(message: string, task: EventTask, status: EventStatus, details: EventDetails, searchTerms: string[]): Promise<Event>;
  updateEvent(log: Partial<Event> & { id: string }): Promise<Event>;
  deleteEvent(id: string): Promise<Event>;
}
