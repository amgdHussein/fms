import { Authority } from '../../../../../core/enums';
import { Discount } from '../../../../../core/models';

import { Product, ProductStatus, ProductTax } from '../../../domain';

// TODO: FILL THE DTO
export class OrganizationProductDto implements Product {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  nameAr?: string;
  descriptionAr?: string;
  status: ProductStatus;
  category: string;
  unitPrice: number;
  unitType: string;
  availableUnits?: number;
  discount?: Discount;

  authority?: Authority; // Tax authority data for that organization
  codeId?: string; // code id in the db
  // code: string;
  taxes?: ProductTax[]; // To apply each kind of tax-type on the invoice items
  taxDiscount?: Discount; // Value not rate (value that discounted from item before calc line amount)
  profitOrLoss?: number; // The difference in value when selling goods already taxed, indicating profit or loss, e.g., +200 EGP if sold for more, -100 EGP if sold for less

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
