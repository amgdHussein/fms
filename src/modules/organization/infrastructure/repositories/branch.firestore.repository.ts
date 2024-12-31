import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService } from '../../../../core/providers';

import { IOrganizationBranchRepository, OrganizationBranch } from '../../domain';

@Injectable()
export class OrganizationBranchFirestoreRepository implements IOrganizationBranchRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.BRANCHES)
    private readonly db: FirestoreService<OrganizationBranch>,
  ) {}

  async get(id: string): Promise<OrganizationBranch> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[]): Promise<OrganizationBranch[]> {
    return this.db.getDocs(filters);
  }

  async add(branch: Partial<OrganizationBranch> & { organizationId: string }): Promise<OrganizationBranch> {
    // Initiate some fields
    branch.createdBy = this.authService.currentUser.uid;
    branch.createdAt = Date.now();
    branch.updatedBy = this.authService.currentUser.uid;
    branch.updatedAt = Date.now();

    return this.db.addDoc(branch);
  }

  async update(branch: Partial<OrganizationBranch> & { id: string }): Promise<OrganizationBranch> {
    // Update some fields
    branch.updatedBy = this.authService.currentUser.uid;
    branch.updatedAt = Date.now();

    return this.db.updateDoc(branch);
  }

  async delete(id: string): Promise<OrganizationBranch> {
    return this.db.deleteDoc(id);
  }
}
