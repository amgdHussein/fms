import { Log, LogStatus, LogTask } from '../../../domain';

export class LogDto implements Log {
  id: string;
  userId: string;
  message: string;
  status: LogStatus;
  task: LogTask;
  details: Record<string, string | number | object>;
  searchTerms: string[];
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
}
