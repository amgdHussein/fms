import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../../core/models';

import { Client, CLIENT_SERVICE_PROVIDER, ClientStatus, IClientService } from '../../../domain';

@Injectable()
export class GetClients implements Usecase<Client> {
  constructor(
    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,
  ) {}

  async execute(filters: QueryFilter[] = [], page = 1, limit = 30, order?: QueryOrder): Promise<Client[]> {
    filters.push({ key: 'status', op: 'neq', value: ClientStatus.DELETED });
    return this.clientService.getClients(filters, page, limit, order);
  }
}
