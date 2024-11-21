import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { IInvoiceItemRepository, Invoice, Item } from '../../domain';

@Injectable()
export class InvoiceItemFirestoreRepository implements IInvoiceItemRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.INVOICES)
    private readonly db: FirestoreService<Invoice>,
  ) {}

  async get(id: string, invoiceId: string): Promise<Item> {
    return this.db.nestedCollection<Item>(invoiceId, 'items').getDoc(id);
  }

  async getMany(invoiceId: string, filters?: QueryFilter[]): Promise<Item[]> {
    return this.db.nestedCollection<Item>(invoiceId, 'items').getDocs(filters);
  }

  async add(item: Partial<Item>, invoiceId: string): Promise<Item> {
    // Initiate some fields
    item.createdBy = this.locker.user.uid;
    item.createdAt = Date.now();
    item.updatedBy = this.locker.user.uid;
    item.updatedAt = Date.now();
    item.invoiceId = invoiceId;

    return this.db.nestedCollection<Item>(invoiceId, 'items').addDoc(item);
  }

  async addMany(items: Partial<Item>[], invoiceId: string): Promise<Item[]> {
    items.forEach(item => {
      // Initiate some fields
      item.createdBy = this.locker.user.uid;
      item.createdAt = Date.now();
      item.updatedBy = this.locker.user.uid;
      item.updatedAt = Date.now();
    });

    return this.db.nestedCollection<Item>(invoiceId, 'items').addDocs(items);
  }

  async update(item: Partial<Item> & { id: string }, invoiceId: string): Promise<Item> {
    // Update some fields
    item.updatedBy = this.locker.user.uid;
    item.updatedAt = Date.now();

    return this.db.nestedCollection<Item>(invoiceId, 'items').updateDoc(item);
  }

  async updateMany(items: (Partial<Item> & { id: string })[], InvoiceId: string): Promise<Item[]> {
    items.forEach(item => {
      // Update some fields
      item.updatedBy = this.locker.user.uid;
      item.updatedAt = Date.now();
    });

    return this.db.nestedCollection<Item>(InvoiceId, 'items').updateDocs(items);
  }

  async delete(id: string, invoiceId: string): Promise<Item> {
    return this.db.nestedCollection<Item>(invoiceId, 'items').deleteDoc(id);
  }

  async deleteMany(InvoiceId: string): Promise<Item[]> {
    return this.db.nestedCollection<Item>(InvoiceId, 'items').deleteDocs();
  }
}
