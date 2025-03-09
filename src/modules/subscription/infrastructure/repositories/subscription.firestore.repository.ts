import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { ISubscriptionRepository, Subscription, SubscriptionStatus } from '../../domain';

@Injectable()
export class SubscriptionFirestoreRepository implements ISubscriptionRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.SUBSCRIPTIONS)
    private readonly db: FirestoreService<Subscription>,
  ) {}

  async get(id: string): Promise<Subscription> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Subscription[]> {
    return this.db.getDocs(filters, page, limit, order);
  }

  async add(subscription: Partial<Subscription>): Promise<Subscription> {
    // Initiate some fields
    subscription.createdBy = this.authService.currentUser.uid;
    subscription.createdAt = Date.now();
    subscription.updatedBy = this.authService.currentUser.uid;
    subscription.updatedAt = Date.now();

    subscription.status = SubscriptionStatus.PENDING;

    return this.db.addDoc(subscription);
  }

  async update(subscription: Partial<Subscription> & { id: string }): Promise<Subscription> {
    // Update some fields
    subscription.updatedBy = this.authService.currentUser.uid;
    subscription.updatedAt = Date.now();

    return this.db.updateDoc(subscription);
  }

  async delete(id: string): Promise<Subscription> {
    return this.db.deleteDoc(id);
  }
}
