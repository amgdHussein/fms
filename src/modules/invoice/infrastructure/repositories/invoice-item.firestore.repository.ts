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

  private itemFirestore(invoiceId: string): FirestoreService<Item> {
    return this.db.nestedCollection<Item>(invoiceId, 'items');
  }

  async get(id: string, invoiceId: string): Promise<Item> {
    return this.itemFirestore(invoiceId).getDoc(id);
  }

  async getMany(invoiceId: string, filters?: QueryFilter[]): Promise<Item[]> {
    return this.itemFirestore(invoiceId).getDocs(filters);
  }

  async add(item: Partial<Item>, invoiceId: string): Promise<Item> {
    // Initiate some fields
    item.createdBy = this.locker.user.uid;
    item.createdAt = Date.now();
    item.updatedBy = this.locker.user.uid;
    item.updatedAt = Date.now();
    item.invoiceId = invoiceId;

    return this.itemFirestore(invoiceId).addDoc(item);
  }

  async addMany(items: Partial<Item>[], invoiceId: string): Promise<Item[]> {
    items.forEach(item => {
      // Initiate some fields
      item.createdBy = this.locker.user.uid;
      item.createdAt = Date.now();
      item.updatedBy = this.locker.user.uid;
      item.updatedAt = Date.now();
    });

    return this.itemFirestore(invoiceId).addDocs(items);
  }

  async update(item: Partial<Item> & { id: string }, invoiceId: string): Promise<Item> {
    // Update some fields
    item.updatedBy = this.locker.user.uid;
    item.updatedAt = Date.now();

    return this.itemFirestore(invoiceId).updateDoc(item);
  }

  async updateMany(items: (Partial<Item> & { id: string })[], invoiceId: string): Promise<Item[]> {
    items.forEach(item => {
      // Update some fields
      item.updatedBy = this.locker.user.uid;
      item.updatedAt = Date.now();
    });

    return this.itemFirestore(invoiceId).updateDocs(items);
  }

  async delete(id: string, invoiceId: string): Promise<Item> {
    return this.itemFirestore(invoiceId).deleteDoc(id);
  }

  async deleteMany(invoiceId: string): Promise<Item[]> {
    return this.itemFirestore(invoiceId).deleteDocs();
  }
}
