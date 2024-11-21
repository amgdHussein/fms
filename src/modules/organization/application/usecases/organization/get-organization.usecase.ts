import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationService, Organization, ORGANIZATION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetOrganization implements Usecase<Organization> {
  constructor(
    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: IOrganizationService,
  ) {}

  async execute(id: string): Promise<Organization> {
    return this.organizationService.getOrganization(id);
  }
}
