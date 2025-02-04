import { Authority, Discount } from '../../../../core/common';
import { ProductTax } from './product-tax.entity';

export enum ProductStatus {
  ACTIVE = 0,
  DRAFT = 1,
  DELETE = 2,
}

// TODO: EACH ORGANIZATION TEAM-MEMBERS CAN ADD SPECIFIC CATEGORIES INTO DATABASE AS ORGANIZATION PREFERENCES TO SELECTED ITEMS IN THE UI

export interface Product {
  id: string;
  organizationId: string; // Unique ID for the organization

  name: string; // Name of the product
  description?: string; // Description of the product
  nameAr?: string; // Arabic name of the product
  descriptionAr?: string; // Description of the product
  status: ProductStatus; // Status of the product (TODO: FOR ALL MODULE ADD ARCHIVED DB)
  category: string; // Category of the product (UI for filtering products)

  unitPrice: number; // Price per unit of the product
  unitType: string; // Type of the unit (car, kilogram, man, ...)
  availableUnits?: number; // Number of units of the product

  discount?: Discount; // Discount applied to the product

  authority?: Authority; // Tax authority data for that organization
  codeId?: string; // code id in the db
  // code: string;
  taxes?: ProductTax[]; // To apply each kind of tax-type on the invoice items
  taxDiscount?: Discount; // Value not rate (value that discounted from item before calc line amount)
  profitOrLoss?: number; // The difference in value when selling goods already taxed, indicating profit or loss, e.g., +200 EGP if sold for more, -100 EGP if sold for less

  createdBy: string; // User who created the product
  createdAt: number; // Timestamp when the product was created
  updatedBy: string; // User who last updated the product
  updatedAt: number; // Timestamp when the product was last updated
}
