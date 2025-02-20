import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter } from '../../../../core/queries';

import { IOrganizationProductRepository, Organization, Product } from '../../domain';

@Injectable()
export class OrganizationProductFirestoreRepository implements IOrganizationProductRepository {
  collectionPath = 'products';

  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ORGANIZATIONS)
    private readonly db: FirestoreService<Organization>,
  ) {}

  async get(id: string, organizationId: string): Promise<Product> {
    return this.db.nestedCollection<Product>(organizationId, this.collectionPath).getDoc(id);
  }

  async getMany(organizationId: string, filters?: QueryFilter[]): Promise<Product[]> {
    return this.db.nestedCollection<Product>(organizationId, this.collectionPath).getDocs(filters);
  }

  async add(product: Partial<Product>, organizationId: string): Promise<Product> {
    // Initiate some fields
    product.createdBy = this.authService.currentUser.uid;
    product.createdAt = Date.now();
    product.updatedBy = this.authService.currentUser.uid;
    product.updatedAt = Date.now();

    console.log('entity', product);

    return this.db.nestedCollection<Product>(organizationId, this.collectionPath).addDoc(product);
  }

  async addMany(products: Partial<Product>[], organizationId: string): Promise<Product[]> {
    console.log('entity', products);

    // Update some fields
    const userId = this.authService.currentUser.uid;
    const now = Date.now();

    products.forEach(product => {
      product.createdBy = userId;
      product.createdAt = now;
      product.updatedBy = userId;
      product.updatedAt = now;
    });

    return this.db.nestedCollection<Product>(organizationId, this.collectionPath).addDocs(products);
  }

  async update(product: Partial<Product> & { id: string }, organizationId: string): Promise<Product> {
    // Update some fields
    product.updatedBy = this.authService.currentUser.uid;
    product.updatedAt = Date.now();

    return this.db.nestedCollection<Product>(organizationId, this.collectionPath).updateDoc(product);
  }

  //TODO: CANNOT USE (Partial<Product> & { id: string })[] IN others methods because fire error id is missing
  async updateMany(products: (Partial<Product> & { id: string })[], organizationId: string): Promise<Product[]> {
    // Update some fields
    const userId = this.authService.currentUser.uid;
    const now = Date.now();

    products.forEach(product => {
      product.updatedBy = userId;
      product.updatedAt = now;
    });

    return this.db.nestedCollection<Product>(organizationId, this.collectionPath).updateDocs(products);
  }

  async delete(id: string, organizationId: string): Promise<Product> {
    return this.db.nestedCollection<Product>(organizationId, this.collectionPath).deleteDoc(id);
  }
}
