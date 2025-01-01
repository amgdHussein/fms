import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/models';

import { ILogRepository, ILogService, Log, LOG_REPOSITORY_PROVIDER, LogDetails, LogStatus, LogTask } from '../../domain';

@Injectable()
export class LogService implements ILogService {
  constructor(
    @Inject(LOG_REPOSITORY_PROVIDER)
    private readonly logRepo: ILogRepository,
  ) {}

  async getLogs(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Log[]> {
    return this.logRepo.getMany(filters, page, limit, order);
  }

  async getLog(id: string): Promise<Log> {
    return this.logRepo.get(id);
  }

  async addLog(userId: string, message: string, task: LogTask, status: LogStatus, details: LogDetails, searchTerms: string[]): Promise<Log> {
    return this.logRepo.add({
      userId,
      message,
      task,
      status,
      details,
      searchTerms,
    });
  }

  async updateLog(invoice: Partial<Log> & { id: string }): Promise<Log> {
    return this.logRepo.update(invoice);
  }

  async deleteLog(id: string): Promise<Log> {
    return this.logRepo.delete(id);
  }
}
