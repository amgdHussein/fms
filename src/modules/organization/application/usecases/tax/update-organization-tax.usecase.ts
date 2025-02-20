import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../../core/common';
import { BadRequestException } from '../../../../../core/exceptions';
import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationTaxService, ORGANIZATION_TAX_SERVICE_PROVIDER, OrganizationTax } from '../../../domain';

@Injectable()
export class UpdateOrganizationTax implements Usecase<OrganizationTax> {
  constructor(
    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly orgTaxService: IOrganizationTaxService,
  ) {}

  async execute(tax: Partial<OrganizationTax> & { id: string; authority: Authority }): Promise<OrganizationTax> {
    const existingTax = await this.orgTaxService.getTaxByTaxIdNumber(tax.taxIdNo, tax.authority);

    //TODO: Check if this is the correct way to check for existing tax
    if (existingTax && existingTax.id !== tax.id) {
      throw new BadRequestException(`Organization with tax id ${tax.taxIdNo} already exists!`);
    }

    return this.orgTaxService.updateTax(tax);
  }
}
