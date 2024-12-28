import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { IInvoiceRepository, Invoice } from '../../domain';

@Injectable()
export class InvoiceFirestoreRepository implements IInvoiceRepository<Invoice> {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.INVOICES)
    private readonly db: FirestoreService<Invoice>,
  ) {}

  async get(id: string): Promise<Invoice> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[]): Promise<Invoice[]> {
    return this.db.getDocs(filters);
  }

  async query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Invoice>> {
    return this.db.query(page, limit, filters, order);
  }

  async add(invoice: Partial<Invoice>): Promise<Invoice> {
    // Initiate some fields
    invoice.createdBy = this.locker.user.uid;
    invoice.createdAt = Date.now();
    invoice.updatedBy = this.locker.user.uid;
    invoice.updatedAt = Date.now();

    return this.db.addDoc(invoice);
  }

  async update(invoice: Partial<Invoice> & { id: string }): Promise<Invoice> {
    // Update some fields
    invoice.updatedBy = this.locker.user.uid;
    invoice.updatedAt = Date.now();

    return this.db.updateDoc(invoice);
  }

  async updateMany(invoices: (Partial<Invoice> & { id: string })[]): Promise<Invoice[]> {
    invoices.forEach(invoice => {
      // Update some fields
      invoice.updatedBy = this.locker.user.uid;
      invoice.updatedAt = Date.now();
    });

    return this.db.updateDocs(invoices);
  }

  async delete(id: string): Promise<Invoice> {
    return this.db.deleteDoc(id);
  }
}
