import { EventTask } from './event-task.enum';

export interface Event {
  id: string; // Unique identifier for the event entry.

  message: string; // Descriptive message or information related to the event entry.
  status: EventStatus; // The current status of the event.
  task: EventTask; // The specific task associated with this event entry.
  details: Record<string, string | number | object>; // Additional details about the event task entry.
  searchTerms: string[]; // An array of search terms derived from the event entry details. These terms facilitate efficient searching within the details object.

  createdAt: number; // Timestamp when the event was created
  updatedAt: number; // Timestamp when the event was updated
}

export enum EventStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}
