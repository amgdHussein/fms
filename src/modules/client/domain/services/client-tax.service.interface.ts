import { Authority } from '../../../../core/common';

import { ClientTax } from '../entities';

export interface IClientTaxService {
  getTax(id: string): Promise<ClientTax>;
  getClientTax(clientId: string, organizationId: string, authority: Authority): Promise<ClientTax>;
  addTax(tax: Partial<ClientTax> & { clientId: string; authority: Authority }): Promise<ClientTax>;
  updateTax(tax: Partial<ClientTax> & { id: string }): Promise<ClientTax>;
  deleteTax(id: string): Promise<ClientTax>;
}
