import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { Item } from '../entities';

export interface IInvoiceItemRepository extends Repository<Item> {
  getMany(InvoiceId: string, filters?: QueryFilter[]): Promise<Item[]>;
  addMany(items: Partial<Item>[], InvoiceId: string): Promise<Item[]>;
  updateMany(items: Partial<Item>[], InvoiceId: string): Promise<Item[]>;
  deleteMany(InvoiceId: string): Promise<Item[]>;
}
