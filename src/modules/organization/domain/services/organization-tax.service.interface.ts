import { Authority } from '../../../../core/common';

import { OrganizationTax } from '../entities';

export interface IOrganizationTaxService {
  getTax(id: string): Promise<OrganizationTax>;
  getTaxByTaxIdNumber(taxIdNo: string, authority: Authority): Promise<OrganizationTax>;
  setTax(tax: Partial<OrganizationTax> & { authority: Authority }): Promise<OrganizationTax>;
  updateTax(tax: Partial<OrganizationTax> & { id: string }): Promise<OrganizationTax>;
  deleteTax(id: string): Promise<OrganizationTax>;
}
