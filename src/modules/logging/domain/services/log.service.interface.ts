import { QueryFilter } from '../../../../core/models';
import { Log, LogStatus, LogTask } from '../entities';

export type LogDetails = Record<string, string | number | object>;

export interface ILogService {
  getLogs(filters?: QueryFilter[], page?: number, limit?: number): Promise<Log[]>;
  getLog(id: string): Promise<Log>;
  addLog(userId: string, message: string, task: LogTask, status: LogStatus, details: LogDetails, searchTerms: string[]): Promise<Log>;
  updateLog(log: Partial<Log> & { id: string }): Promise<Log>;
  deleteLog(id: string): Promise<Log>;
}
