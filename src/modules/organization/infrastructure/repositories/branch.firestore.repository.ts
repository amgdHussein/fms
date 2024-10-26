import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { IOrganizationBranchRepository, OrganizationBranch } from '../../domain';

@Injectable()
export class OrganizationBranchFirestoreRepository implements IOrganizationBranchRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.BRANCHES)
    private readonly db: FirestoreService<OrganizationBranch>,
  ) {}

  async get(id: string): Promise<OrganizationBranch> {
    return this.db.getDoc(id);
  }

  async getAll(filters?: QueryFilter[]): Promise<OrganizationBranch[]> {
    return this.db.getDocs(filters);
  }

  async add(branch: Partial<OrganizationBranch> & { systemId: string }): Promise<OrganizationBranch> {
    // Initiate some fields
    branch.createdBy = this.locker.user.uid;
    branch.createdAt = Date.now();
    branch.updatedBy = this.locker.user.uid;
    branch.updatedAt = Date.now();

    return this.db.addDoc(branch);
  }

  async update(branch: Partial<OrganizationBranch> & { id: string }): Promise<OrganizationBranch> {
    // Update some fields
    branch.updatedBy = this.locker.user.uid;
    branch.updatedAt = Date.now();

    return this.db.updateDoc(branch);
  }

  async delete(id: string): Promise<OrganizationBranch> {
    return this.db.deleteDoc(id);
  }
}
