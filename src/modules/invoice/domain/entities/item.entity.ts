import { Discount } from '../../../../core/common';
import { ItemTax } from './item-tax.entity';

export interface Item {
  id: string;
  organizationId: string; // Unique ID for the organization
  profileId: string; // Unique ID for the client profile
  clientId: string; // Unique ID for the client
  invoiceId: string; // Unique ID for the invoice
  productId: string; // Unique ID for the organization product
  codeId: string; // Unique ID for the tax code

  name: string; // Name of the product
  description?: string; // Description of the product
  nameAr?: string; // Arabic name of the product
  descriptionAr?: string; // Description of the product
  category: string; // Category of the product (UI for filtering products)

  unitPrice: number; // Price per unit of the product
  unitType: string; // Type of the unit (car, kilogram, man, ...)
  quantity: number; // Quantity of the item
  discount?: Discount; // Discount applied to the product

  grossAmount: number; // ? amount // The total cost of all products before taxes and discounts
  netAmount: number; // ? netTotal // The total cost after discounts but before taxes
  totalAmount: number; // The total cost after discounts and taxes

  // TODO: ADD TYPES TO THE SYSTEM
  wightType?: string; // Type of wight measurement of unit (gram, kilogram, ton, etc.)
  wight?: number; // The total weight of the items

  taxes?: ItemTax[]; // To apply each kind of tax-type on the invoice items
  taxDiscount?: Discount; // Value not rate (value that discounted from item before calc line amount)
  profitOrLoss?: number; // The difference in value when selling goods already taxed, indicating profit or loss, e.g., +200 EGP if sold for more, -100 EGP if sold for less

  createdBy: string; // User who created the product
  createdAt: number; // Timestamp when the product was created
  updatedBy: string; // User who last updated the product
  updatedAt: number; // Timestamp when the product was last updated
}
