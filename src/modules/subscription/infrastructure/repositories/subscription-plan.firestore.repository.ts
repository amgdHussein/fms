import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { ISubscriptionPlanRepository, Plan } from '../../domain';

@Injectable()
export class SubscriptionPlanFirestoreRepository implements ISubscriptionPlanRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.SUBSCRIPTION_PLANS)
    private readonly db: FirestoreService<Plan>,
  ) {}

  async get(id: string): Promise<Plan> {
    return this.db.getDoc(id);
  }

  async getMany(): Promise<Plan[]> {
    return this.db.getDocs();
  }

  async add(plan: Partial<Plan>): Promise<Plan> {
    // Initiate some fields
    plan.createdBy = this.authService.currentUser.uid;
    plan.createdAt = Date.now();
    plan.updatedBy = this.authService.currentUser.uid;
    plan.updatedAt = Date.now();

    return this.db.addDoc(plan);
  }

  async update(plan: Partial<Plan> & { id: string }): Promise<Plan> {
    // Update some fields
    plan.updatedBy = this.authService.currentUser.uid;
    plan.updatedAt = Date.now();

    return this.db.updateDoc(plan);
  }

  async delete(id: string): Promise<Plan> {
    return this.db.deleteDoc(id);
  }
}
