import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../../core/models';

import { IOrganizationService, Organization, ORGANIZATION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetOrganizations implements Usecase<Organization> {
  constructor(
    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: IOrganizationService,
  ) {}

  async execute(filters: QueryFilter[] = [], page = 1, limit = 10, order?: QueryOrder): Promise<Organization[]> {
    return this.organizationService.getOrganizations(filters, page, limit, order);
  }
}
