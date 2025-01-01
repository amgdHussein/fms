import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/models';

import { Item } from '../entities';

export interface IInvoiceItemRepository extends Repository<Item> {
  getMany(invoiceId: string, filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Item[]>;
  addMany(items: Partial<Item>[], invoiceId: string): Promise<Item[]>;
  updateMany(items: Partial<Item>[], invoiceId: string): Promise<Item[]>;
  deleteMany(invoiceId: string): Promise<Item[]>;
}
