import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter } from '../../../../core/queries';

import { IOrganizationProductRepository, Organization, Product } from '../../domain';

@Injectable()
export class OrganizationProductFirestoreRepository implements IOrganizationProductRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ORGANIZATIONS)
    private readonly db: FirestoreService<Organization>,
  ) {}

  async get(id: string, organizationId: string): Promise<Product> {
    return this.db.nestedCollection<Product>(organizationId, 'products').getDoc(id);
  }

  async getMany(organizationId: string, filters?: QueryFilter[]): Promise<Product[]> {
    return this.db.nestedCollection<Product>(organizationId, 'products').getDocs(filters);
  }

  async add(product: Partial<Product>, organizationId: string): Promise<Product> {
    // Initiate some fields
    product.createdBy = this.authService.currentUser.uid;
    product.createdAt = Date.now();
    product.updatedBy = this.authService.currentUser.uid;
    product.updatedAt = Date.now();

    return this.db.nestedCollection<Product>(organizationId, 'products').addDoc(product);
  }

  async update(product: Partial<Product> & { id: string }, organizationId: string): Promise<Product> {
    // Update some fields
    product.updatedBy = this.authService.currentUser.uid;
    product.updatedAt = Date.now();

    return this.db.nestedCollection<Product>(organizationId, 'products').updateDoc(product);
  }

  async delete(id: string, organizationId: string): Promise<Product> {
    return this.db.nestedCollection<Product>(organizationId, 'products').deleteDoc(id);
  }
}
