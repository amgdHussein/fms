import { Discount } from '../../../../../core/models';
import { ProductTax } from '../../../../organization/domain';
import { Item } from '../../../domain';

// TODO: FILL THE DTO
export class InvoiceItemDto implements Item {
  id: string;
  organizationId: string;
  profileId: string;
  clientId: string;
  invoiceId: string;
  productId: string;
  codeId: string;
  name: string;
  description?: string;
  nameAr?: string;
  descriptionAr?: string;
  category: string;
  unitPrice: number;
  unitType: string;
  quantity: number;
  discount?: Discount;
  grossAmount: number;
  netAmount: number;
  totalAmount: number;
  wightType?: string;
  wight?: number;
  taxes?: ProductTax[];
  taxDiscount?: Discount;
  profitOrLoss?: number;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
