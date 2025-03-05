import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { IPaymentRepository, Payment, PaymentStatus } from '../../domain';

@Injectable()
export class PaymentFirestoreRepository implements IPaymentRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.PAYMENTS)
    private readonly db: FirestoreService<Payment>,
  ) {}

  async getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Payment[]> {
    return this.db.getDocs(filters, page, limit, order);
  }

  async get(id: string): Promise<Payment> {
    return this.db.getDoc(id);
  }

  async add(payment: Partial<Payment>): Promise<Payment> {
    // Initiate some fields
    payment.createdBy = this.authService.currentUser.uid;
    payment.createdAt = Date.now();
    payment.updatedBy = this.authService.currentUser.uid;
    payment.updatedAt = Date.now();

    payment.status = PaymentStatus.PROCESSING;

    return this.db.addDoc(payment);
  }

  async addMany(payments: Partial<Payment>[]): Promise<Payment[]> {
    return this.db.addDocs(payments);
  }

  async update(payment: Partial<Payment> & { id: string }): Promise<Payment> {
    // Update some fields
    payment.updatedBy = this.authService.currentUser.uid;
    payment.updatedAt = Date.now();

    return this.db.updateDoc(payment);
  }

  async delete(id: string): Promise<Payment> {
    return this.db.deleteDoc(id);
  }
}
