import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { IPaymentRepository, Payment } from '../../domain';

@Injectable()
export class PaymentFirestoreRepository implements IPaymentRepository {
  constructor(
    @Inject(FIRESTORE_COLLECTION_PROVIDERS.PAYMENTS)
    private readonly db: FirestoreService<Payment>,
  ) {}

  async getAll(): Promise<Payment[]> {
    return await this.db.getDocs();
  }

  async query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Payment>> {
    return await this.db.query(filters, page, limit, order);
  }

  async get(id: string): Promise<Payment> {
    return await this.db.getDoc(id);
  }

  async add(payment: Payment): Promise<Payment> {
    return await this.db.addDoc(payment);
  }

  async addBatch(payments: Payment[]): Promise<Payment[]> {
    return await this.db.addDocs(payments);
  }

  async update(payment: Partial<Payment> & { id: string }): Promise<Payment> {
    return await this.db.updateDoc(payment);
  }

  async delete(id: string): Promise<Payment> {
    return await this.db.deleteDoc(id);
  }
}
