import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../../core/common';
import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationTaxService, ORGANIZATION_TAX_SERVICE_PROVIDER, OrganizationTax } from '../../../domain';

@Injectable()
export class UpdateOrganizationTax implements Usecase<OrganizationTax> {
  constructor(
    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly orgTaxService: IOrganizationTaxService,
  ) {}

  async execute(tax: Partial<OrganizationTax>, organizationId: string, authority: Authority): Promise<OrganizationTax> {
    const existingTax = await this.orgTaxService.getOrganizationTax(organizationId, authority);
    return this.orgTaxService.updateTax({ ...tax, id: existingTax.id });
  }
}
