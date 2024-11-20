import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { IOrganizationTaxRepository, OrganizationTax } from '../../domain';

@Injectable()
export class OrganizationTaxFirestoreRepository implements IOrganizationTaxRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ORGANIZATIONS_TAXES)
    private readonly db: FirestoreService<OrganizationTax>,
  ) {}

  async get(id: string): Promise<OrganizationTax> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[]): Promise<OrganizationTax[]> {
    return this.db.getDocs(filters);
  }

  async add(tax: Partial<OrganizationTax> & { userId: string }): Promise<OrganizationTax> {
    // Initiate some fields
    tax.createdBy = this.locker.user.uid;
    tax.createdAt = Date.now();
    tax.updatedBy = this.locker.user.uid;
    tax.updatedAt = Date.now();

    return this.db.addDoc(tax);
  }

  async update(tax: Partial<OrganizationTax> & { id: string }): Promise<OrganizationTax> {
    // Update some fields
    tax.updatedBy = this.locker.user.uid;
    tax.updatedAt = Date.now();

    return this.db.updateDoc(tax);
  }

  async delete(id: string): Promise<OrganizationTax> {
    return this.db.deleteDoc(id);
  }
}
