import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../../core/models';

import { IOrganizationService, Organization, ORGANIZATION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class QueryOrganizations implements Usecase<Organization> {
  constructor(
    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: IOrganizationService,
  ) {}

  async execute(page = 1, limit = 10, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Organization>> {
    return this.organizationService.queryOrganizations(page, limit, filters, order);
  }
}
