import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { QueryFilter } from '../../../../../core/models';
import { ILogService, Log, LOG_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetLogs implements Usecase<Log> {
  constructor(
    @Inject(LOG_SERVICE_PROVIDER)
    private readonly logService: ILogService,
  ) {}

  async execute(filters?: QueryFilter[], page = 1, limit = 10): Promise<Log[]> {
    return this.logService.getLogs(filters, page, limit);
  }
}
