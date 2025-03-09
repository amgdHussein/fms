import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { ISubscriptionUsageRepository, Subscription, Usage } from '../../domain';

@Injectable()
export class SubscriptionUsageFirestoreRepository implements ISubscriptionUsageRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.SUBSCRIPTIONS)
    private readonly db: FirestoreService<Subscription>,
  ) {}

  private usageFirestore(subscriptionId: string): FirestoreService<Usage> {
    return this.db.nestedCollection<Usage>(subscriptionId, 'usage');
  }

  async get(id: string, subscriptionId: string): Promise<Usage> {
    return this.usageFirestore(subscriptionId).getDoc(id);
  }

  async getMany(subscriptionId: string): Promise<Usage[]> {
    return this.usageFirestore(subscriptionId).getDocs();
  }

  async add(usage: Partial<Usage>, subscriptionId: string): Promise<Usage> {
    // Initiate some fields
    usage.createdBy = this.authService.currentUser.uid;
    usage.createdAt = Date.now();
    usage.updatedBy = this.authService.currentUser.uid;
    usage.updatedAt = Date.now();

    return this.usageFirestore(subscriptionId).addDoc(usage);
  }

  async addMany(usage: Partial<Usage>[], subscriptionId: string): Promise<Usage[]> {
    // Update some fields
    const userId = this.authService.currentUser.uid;
    const now = Date.now();

    usage.forEach(usage => {
      usage.createdBy = userId;
      usage.createdAt = now;
      usage.updatedBy = userId;
      usage.updatedAt = now;
    });

    return this.usageFirestore(subscriptionId).addDocs(usage);
  }

  async update(usage: Partial<Usage> & { id: string }, subscriptionId: string): Promise<Usage> {
    // Update some fields
    usage.updatedBy = this.authService.currentUser.uid;
    usage.updatedAt = Date.now();

    return this.usageFirestore(subscriptionId).updateDoc(usage);
  }

  async delete(id: string, subscriptionId: string): Promise<Usage> {
    return this.usageFirestore(subscriptionId).deleteDoc(id);
  }
}
