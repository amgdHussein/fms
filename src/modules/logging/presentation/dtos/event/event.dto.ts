import { Event, EventStatus, EventTask } from '../../../domain';

export class EventDto implements Event {
  id: string;
  message: string;
  status: EventStatus;
  task: EventTask;
  details: Record<string, string | number | object>;
  searchTerms: string[];
  createdAt: number;
  updatedAt: number;
}
