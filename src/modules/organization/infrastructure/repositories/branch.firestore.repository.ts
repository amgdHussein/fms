import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService } from '../../../../core/providers';

import { Branch, IBranchRepository } from '../../domain';

@Injectable()
export class BranchFirestoreRepository implements IBranchRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.BRANCHES)
    private readonly db: FirestoreService<Branch>,
  ) {}

  async get(id: string): Promise<Branch> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[]): Promise<Branch[]> {
    return this.db.getDocs(filters);
  }

  async add(branch: Partial<Branch> & { organizationId: string }): Promise<Branch> {
    // Initiate some fields
    branch.createdBy = this.authService.currentUser.uid;
    branch.createdAt = Date.now();
    branch.updatedBy = this.authService.currentUser.uid;
    branch.updatedAt = Date.now();

    return this.db.addDoc(branch);
  }

  async addMany(branches: (Partial<Branch> & { organizationId: string })[]): Promise<Branch[]> {
    branches.forEach(branch => {
      // Initiate some fields
      branch.createdBy = this.authService.currentUser.uid;
      branch.createdAt = Date.now();
      branch.updatedBy = this.authService.currentUser.uid;
      branch.updatedAt = Date.now();
    });

    return this.db.addDocs(branches);
  }

  async update(branch: Partial<Branch> & { id: string }): Promise<Branch> {
    // Update some fields
    branch.updatedBy = this.authService.currentUser.uid;
    branch.updatedAt = Date.now();

    return this.db.updateDoc(branch);
  }

  async delete(id: string): Promise<Branch> {
    return this.db.deleteDoc(id);
  }
}
