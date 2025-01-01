import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { QueryFilter, QueryOrder } from '../../../../core/models';
import { FirestoreService } from '../../../../core/providers';

import { ClientTax, IClientTaxRepository } from '../../domain';

@Injectable()
export class ClientTaxFirestoreRepository implements IClientTaxRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.CLIENTS_TAXES)
    private readonly db: FirestoreService<ClientTax>,
  ) {}

  async get(id: string): Promise<ClientTax> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<ClientTax[]> {
    return this.db.getDocs(filters, page, limit, order);
  }

  async add(tax: Partial<ClientTax> & { userId: string }): Promise<ClientTax> {
    // Initiate some fields
    tax.createdBy = this.authService.currentUser.uid;
    tax.createdAt = Date.now();
    tax.updatedBy = this.authService.currentUser.uid;
    tax.updatedAt = Date.now();

    return this.db.addDoc(tax);
  }

  async update(tax: Partial<ClientTax> & { id: string }): Promise<ClientTax> {
    // Update some fields
    tax.updatedBy = this.authService.currentUser.uid;
    tax.updatedAt = Date.now();

    return this.db.updateDoc(tax);
  }

  async delete(id: string): Promise<ClientTax> {
    return this.db.deleteDoc(id);
  }
}
