import { Inject, Injectable } from '@nestjs/common';

import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { AuthService } from '../../../../core/auth';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/queries';
import { IReceiptRepository, Receipt } from '../../domain';

@Injectable()
export class ReceiptFirestoreRepository implements IReceiptRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.RECEIPTS)
    private readonly db: FirestoreService<Receipt>,
  ) {}

  async getAll(): Promise<Receipt[]> {
    return await this.db.getDocs();
  }

  async query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Receipt>> {
    return await this.db.query(filters, page, limit, order);
  }

  async get(id: string): Promise<Receipt> {
    return await this.db.getDoc(id);
  }

  async add(receipt: Receipt): Promise<Receipt> {
    // Initiate some fields
    receipt.createdBy = this.authService.currentUser.uid;
    receipt.createdAt = Date.now();
    receipt.updatedBy = this.authService.currentUser.uid;
    receipt.updatedAt = Date.now();

    return await this.db.addDoc(receipt);
  }

  async addBatch(receipts: Receipt[]): Promise<Receipt[]> {
    // Initiate some fields for each code
    receipts.forEach(payment => {
      payment.createdBy = this.authService.currentUser.uid;
      payment.createdAt = Date.now();
    });
    return await this.db.addDocs(receipts);
  }

  async update(receipt: Partial<Receipt> & { id: string }): Promise<Receipt> {
    // Update some fields
    receipt.updatedBy = this.authService.currentUser.uid;
    receipt.updatedAt = Date.now();
    return await this.db.updateDoc(receipt);
  }

  async delete(id: string): Promise<Receipt> {
    return await this.db.deleteDoc(id);
  }
}
