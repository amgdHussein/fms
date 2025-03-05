import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Action } from '../../../../core/enums';
import { CLIENT_REPOSITORY_PROVIDER, IClientRepository } from '../../../client/domain';
import {
  IInvoiceItemRepository,
  IInvoiceRepository,
  IInvoiceService,
  Invoice,
  INVOICE_ITEM_REPOSITORY_PROVIDER,
  INVOICE_REPOSITORY_PROVIDER,
  InvoiceStatus,
  Item,
} from '../../domain';

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(
    @Inject(INVOICE_REPOSITORY_PROVIDER)
    private readonly invoiceRepo: IInvoiceRepository<Invoice>,

    @Inject(INVOICE_ITEM_REPOSITORY_PROVIDER)
    private readonly itemRepo: IInvoiceItemRepository,

    @Inject(CLIENT_REPOSITORY_PROVIDER)
    private readonly clientRepo: IClientRepository,
  ) {}

  // ? Invoice Related

  async getInvoice(id: string): Promise<Invoice> {
    return this.invoiceRepo.get(id);
  }

  async getInvoices(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Invoice[]> {
    return this.invoiceRepo.getMany(filters, page, limit, order);
  }

  async addInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    const { items, ...invoiceData } = invoice;

    const newInvoice = await this.invoiceRepo.add(invoiceData);

    // Add invoice items
    if (items && items.length) {
      newInvoice.items = await this.addItems(items, newInvoice.id);
    }

    // Update client aggregation
    await this.updateClientAggregation(newInvoice);

    return newInvoice;
  }

  async updateInvoice(invoice: Partial<Invoice> & { id: string }): Promise<Invoice> {
    const oldInvoice = await this.invoiceRepo.get(invoice.id);
    const { items, ...newInvoice } = invoice;

    // Update invoice
    const updatedInvoice = await this.invoiceRepo.update(newInvoice);

    // Update invoice items if provided
    if (items && items.length) {
      updatedInvoice.items = await this.updateItems(items as (Partial<Item> & { id: string; action: Action })[], invoice.id);
    }

    // Update client aggregation
    await this.updateClientAggregation(updatedInvoice, oldInvoice);

    return updatedInvoice;
  }

  //TODO: ADD UPDATE INVOICES

  async deleteInvoice(id: string): Promise<Invoice> {
    const items = await this.deleteItems(id);
    const oldInvoice = await this.invoiceRepo.delete(id);

    // Update client aggregation
    await this.updateClientAggregation(oldInvoice, undefined, true);

    return { ...oldInvoice, items };
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async sendClientInvoice(id: string): Promise<boolean> {
    return true;
    // if (!invoice.clientData.email) {
    //   console.error('no client email found');
    //   return;
    // }
    // const organization = await this.getCurrentOrg(this.systemId);

    // // const invoiceBody = this.createInvoiceTable(invoice, organization);
    // const mail: Mail = {
    //   // recipient: 'mahmoudmohyeldin.iqranetwork@gmail.com',
    //   recipient: invoice.clientData.email,
    //   replyTo: process.env.GMAIL_AUTH_USER,
    //   senderName: organization.businessName,
    //   subject: `${organization.businessName} sent you an invoice: ${invoice.invoiceNumber}`,
    //   body: '',
    //   senderType: SenderType.SUPPORT,
    // };

    // this.gmailService.addJob(mail);
  }

  private async updateClientAggregation(invoice: Invoice, oldInvoice?: Invoice, isDelete = false): Promise<void> {
    // Only update if the invoice is neither DRAFT nor PAID, and has a due date.
    if (invoice.status == InvoiceStatus.DRAFT || invoice.status == InvoiceStatus.PAID || invoice.dueAt == null) return;

    const client = await this.clientRepo.get(invoice.clientId);

    let updatedTotal = client.totalInvoiceAmount ?? 0;
    const newTotal = invoice.totalAmount || 0;

    if (isDelete) {
      // Subtract the old invoice total
      updatedTotal -= newTotal;
    } else if (oldInvoice) {
      // On update: add the difference between the new and the old total
      const oldTotal = oldInvoice.totalAmount || 0;
      updatedTotal += newTotal - oldTotal;
    } else {
      // On add: just add the invoice total
      updatedTotal += newTotal;
    }

    await this.clientRepo.update({ id: client.id, totalInvoiceAmount: updatedTotal });
  }

  // ? Invoice Item Related

  async getInvoiceItems(invoiceId: string): Promise<Item[]> {
    return this.itemRepo.getMany(invoiceId);
  }

  private async addItems(items: Partial<Item>[], invoiceId: string): Promise<Item[]> {
    return this.itemRepo.addMany(items, invoiceId);
  }

  private async updateItems(items: (Partial<Item> & { id?: string; action: Action })[], invoiceId: string): Promise<Item[]> {
    // Prepare arrays for new, updated, and deleted items
    const itemsToAdd = items
      .filter(item => item.action === Action.ADD)
      .map(item => {
        const { action, ...itemData } = item;
        return itemData;
      });

    const itemsToUpdate = items
      .filter(item => item.action === Action.UPDATE)
      .map(item => {
        const { action, ...itemData } = item;
        return itemData;
      });

    const itemsToDelete = items
      .filter(item => item.action === Action.DELETE)
      .map(item => {
        const { action, ...itemData } = item;
        return itemData;
      });

    // 1. Handle newly added items
    if (itemsToAdd.length) {
      await this.itemRepo.addMany(itemsToAdd, invoiceId);
    }

    // 2. Handle updated items
    if (itemsToUpdate.length) {
      await this.itemRepo.updateMany(itemsToUpdate, invoiceId);
    }

    // 3. Handle deleted items
    for (const item of itemsToDelete) {
      if (!item.id) continue; // Safety check
      await this.itemRepo.delete(item.id);
    }

    // Finally, return the updated list of items for this invoice
    return this.itemRepo.getMany(invoiceId);
  }

  private async deleteItems(invoiceId: string): Promise<Item[]> {
    return this.itemRepo.deleteMany(invoiceId);
  }
}
