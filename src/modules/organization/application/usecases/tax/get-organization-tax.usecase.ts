import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationTaxService, ORGANIZATION_TAX_SERVICE_PROVIDER, OrganizationTax } from '../../../domain';

@Injectable()
export class GetOrganizationTax implements Usecase<OrganizationTax> {
  constructor(
    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly orgTaxService: IOrganizationTaxService,
  ) {}

  async execute(organizationId: string): Promise<OrganizationTax> {
    return this.orgTaxService.getTax(organizationId);
  }
}
