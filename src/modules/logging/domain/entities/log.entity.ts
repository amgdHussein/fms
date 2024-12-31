import { LogTask } from './log-task.enum';

export interface Log {
  id: string; // Unique identifier for the log entry.
  userId: string; // Unique identifier for the user who performed the task.

  message: string; // Descriptive message or information related to the log entry.
  status: LogStatus; // The current status of the log.
  task: LogTask; // The specific task associated with this log entry.
  details: Record<string, string | number | object>; // Additional details about the log task entry.
  searchTerms: string[]; // An array of search terms derived from the log entry details. These terms facilitate efficient searching within the details object.

  createdAt: number; // Timestamp when the log was created
  createdBy: string; // ID of the user who created the log
  updatedAt: number; // Timestamp when the log was updated
  updatedBy: string; // ID of the user who last updated the log
}

export enum LogStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}
