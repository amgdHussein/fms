import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import {
  IInvoiceItemRepository,
  IInvoiceRepository,
  IInvoiceService,
  Invoice,
  INVOICE_ITEM_REPOSITORY_PROVIDER,
  INVOICE_REPOSITORY_PROVIDER,
  Item,
} from '../../domain';

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(
    @Inject(INVOICE_REPOSITORY_PROVIDER)
    private readonly invoiceRepo: IInvoiceRepository,

    @Inject(INVOICE_ITEM_REPOSITORY_PROVIDER)
    private readonly itemRepo: IInvoiceItemRepository,
  ) {}

  // ? Invoice Related

  async getInvoice(id: string): Promise<Invoice> {
    return this.invoiceRepo.get(id);
  }

  async getInvoices(filters?: QueryFilter[]): Promise<Invoice[]> {
    return this.invoiceRepo.getMany(filters);
  }

  async queryInvoices(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Invoice>> {
    return this.invoiceRepo.query(page, limit, filters, order);
  }

  async addInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    return this.invoiceRepo.add(invoice);
  }

  async updateInvoice(invoice: Partial<Invoice> & { id: string }): Promise<Invoice> {
    return this.invoiceRepo.update(invoice);
  }

  async deleteInvoice(id: string): Promise<Invoice> {
    return this.invoiceRepo.delete(id);
  }

  // ? Invoice Item Related

  async getItems(invoiceId: string): Promise<Item[]> {
    return this.itemRepo.getMany(invoiceId);
  }

  async addItems(items: Partial<Item>[], invoiceId: string): Promise<Item[]> {
    return this.itemRepo.addMany(items, invoiceId);
  }

  async updateItems(items: (Partial<Item> & { id: string })[], invoiceId: string): Promise<Item[]> {
    // TODO: CHECK OUT THE EXISTED ITEMS AND UPDATE THEM
    // TODO: NEW ITEMS WILL BE ADDED
    // TODO: DELETED ITEMS WILL BE DELETED
    return this.itemRepo.updateMany(items, invoiceId);
  }

  async deleteItems(invoiceId: string): Promise<Item[]> {
    return this.itemRepo.deleteMany(invoiceId);
  }
}
