import { Inject, Injectable } from '@nestjs/common';

import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { AuthService } from '../../../../core/auth';
import { IInvoiceItemRepository, Invoice, Item } from '../../domain';

@Injectable()
export class InvoiceItemFirestoreRepository implements IInvoiceItemRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.INVOICES)
    private readonly db: FirestoreService<Invoice>,
  ) {}

  private itemFirestore(invoiceId: string): FirestoreService<Item> {
    return this.db.nestedCollection<Item>(invoiceId, 'items');
  }

  async get(id: string, invoiceId: string): Promise<Item> {
    return this.itemFirestore(invoiceId).getDoc(id);
  }

  async getMany(invoiceId: string, filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Item[]> {
    return this.itemFirestore(invoiceId).getDocs(filters, page, limit, order);
  }

  async add(item: Partial<Item>, invoiceId: string): Promise<Item> {
    // Initiate some fields
    item.createdBy = this.authService.currentUser.uid;
    item.createdAt = Date.now();
    item.updatedBy = this.authService.currentUser.uid;
    item.updatedAt = Date.now();
    item.invoiceId = invoiceId;

    return this.itemFirestore(invoiceId).addDoc(item);
  }

  async addMany(items: Partial<Item>[], invoiceId: string): Promise<Item[]> {
    items.forEach(item => {
      // Initiate some fields
      item.createdBy = this.authService.currentUser.uid;
      item.createdAt = Date.now();
      item.updatedBy = this.authService.currentUser.uid;
      item.updatedAt = Date.now();
    });

    return this.itemFirestore(invoiceId).addDocs(items);
  }

  async update(item: Partial<Item> & { id: string }, invoiceId: string): Promise<Item> {
    // Update some fields
    item.updatedBy = this.authService.currentUser.uid;
    item.updatedAt = Date.now();

    return this.itemFirestore(invoiceId).updateDoc(item);
  }

  async updateMany(items: (Partial<Item> & { id: string })[], invoiceId: string): Promise<Item[]> {
    items.forEach(item => {
      // Update some fields
      item.updatedBy = this.authService.currentUser.uid;
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
