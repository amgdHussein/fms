import { QueryFilter, QueryOrder } from '../../../../core/models';

import { Invoice, Item } from '../entities';

export interface IInvoiceService {
  // ? Invoice Related
  getInvoice(id: string): Promise<Invoice>;
  getInvoices(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Invoice[]>;
  addInvoice(invoice: Partial<Invoice> & { organizationId: string }): Promise<Invoice>;
  updateInvoice(invoice: Partial<Invoice> & { id: string }): Promise<Invoice>;
  deleteInvoice(id: string): Promise<Invoice>;

  // ? Invoice Item Related
  getItems(invoiceId: string): Promise<Item[]>;
  addItems(items: Partial<Item>[], invoiceId: string): Promise<Item[]>;
  updateItems(items: (Partial<Item> & { id: string })[], invoiceId: string): Promise<Item[]>;
  deleteItems(invoiceId: string): Promise<Item[]>;

  sendClientInvoice(id: string): Promise<boolean>;
  // getInvoiceByShareLink(invoiceId: string): Promise<EInvoice>;
}
