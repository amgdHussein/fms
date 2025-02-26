import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../../core/enums';
import { BadRequestException } from '../../../../../core/exceptions';
import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationTaxService, ORGANIZATION_TAX_SERVICE_PROVIDER, OrganizationTax } from '../../../domain';

@Injectable()
export class AssignOrganizationTax implements Usecase<OrganizationTax> {
  constructor(
    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly orgTaxService: IOrganizationTaxService,
  ) {}

  async execute(tax: Partial<OrganizationTax> & { organizationId: string; authority: Authority }): Promise<OrganizationTax> {
    const existingTax = await this.orgTaxService.getTaxByTaxIdNumber(tax.taxIdNo, tax.authority);

    if (existingTax) {
      throw new BadRequestException(`Organization with tax id ${tax.taxIdNo} already exists!`);
    }

    const { organizationId, ...rest } = tax;
    return this.orgTaxService.setTax({
      ...rest,
      id: organizationId,
    });
  }
}
