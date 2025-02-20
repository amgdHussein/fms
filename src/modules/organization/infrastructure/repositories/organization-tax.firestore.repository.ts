import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { IOrganizationTaxRepository, OrganizationTax } from '../../domain';

@Injectable()
export class OrganizationTaxFirestoreRepository implements IOrganizationTaxRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ORGANIZATIONS_TAXES)
    private readonly db: FirestoreService<OrganizationTax>,
  ) {}

  async get(id: string): Promise<OrganizationTax> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<OrganizationTax[]> {
    return this.db.getDocs(filters, page, limit, order);
  }

  async add(tax: OrganizationTax & { userId: string; id: string }): Promise<OrganizationTax> {
    // Initiate some fields
    tax.createdBy = this.authService.currentUser.uid;
    tax.createdAt = Date.now();
    tax.updatedBy = this.authService.currentUser.uid;
    tax.updatedAt = Date.now();

    return this.db.setDoc(tax); //TODO: I MAKE THIS SET
  }

  async update(tax: Partial<OrganizationTax> & { id: string }): Promise<OrganizationTax> {
    // Update some fields
    tax.updatedBy = this.authService.currentUser.uid;
    tax.updatedAt = Date.now();

    return this.db.updateDoc(tax);
  }

  async delete(id: string): Promise<OrganizationTax> {
    return this.db.deleteDoc(id);
  }
}
