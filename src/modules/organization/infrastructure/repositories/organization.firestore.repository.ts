import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { FirestoreService } from '../../../../core/providers';

import { IOrganizationRepository, Organization } from '../../domain';

@Injectable()
export class OrganizationFirestoreRepository implements IOrganizationRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ORGANIZATIONS)
    private readonly db: FirestoreService<Organization>,
  ) {}

  async get(id: string): Promise<Organization> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[]): Promise<Organization[]> {
    return this.db.getDocs(filters);
  }

  async query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Organization>> {
    return this.db.query(page, limit, filters, order);
  }

  async add(organization: Partial<Organization> & { userId: string }): Promise<Organization> {
    // Initiate some fields
    organization.createdBy = this.authService.currentUser.uid;
    organization.createdAt = Date.now();
    organization.updatedBy = this.authService.currentUser.uid;
    organization.updatedAt = Date.now();

    return this.db.addDoc(organization);
  }

  async update(organization: Partial<Organization> & { id: string }): Promise<Organization> {
    // Update some fields
    organization.updatedBy = this.authService.currentUser.uid;
    organization.updatedAt = Date.now();

    return this.db.updateDoc(organization);
  }

  async delete(id: string): Promise<Organization> {
    return this.db.deleteDoc(id);
  }
}
