import { Discount } from '../../../../../core/common';

import { Product, ProductStatus } from '../../../domain';

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
  availableUnits: number;
  discount?: Discount;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
