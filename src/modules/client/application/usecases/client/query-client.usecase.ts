import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../../core/models';

import { Client, CLIENT_SERVICE_PROVIDER, IClientService } from '../../../domain';

@Injectable()
export class QueryClients implements Usecase<Client> {
  constructor(
    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,
  ) {}

  async execute(page = 1, limit = 10, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Client>> {
    return this.clientService.queryClients(page, limit, filters, order);
  }
}
