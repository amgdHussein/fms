import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { ClientTax, IClientTaxRepository } from '../../domain';

@Injectable()
export class ClientTaxFirestoreRepository implements IClientTaxRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.CLIENTS_TAXES)
    private readonly db: FirestoreService<ClientTax>,
  ) {}

  async get(id: string): Promise<ClientTax> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[]): Promise<ClientTax[]> {
    return this.db.getDocs(filters);
  }

  async add(tax: Partial<ClientTax> & { userId: string }): Promise<ClientTax> {
    // Initiate some fields
    tax.createdBy = this.locker.user.uid;
    tax.createdAt = Date.now();
    tax.updatedBy = this.locker.user.uid;
    tax.updatedAt = Date.now();

    return this.db.addDoc(tax);
  }

  async update(tax: Partial<ClientTax> & { id: string }): Promise<ClientTax> {
    // Update some fields
    tax.updatedBy = this.locker.user.uid;
    tax.updatedAt = Date.now();

    return this.db.updateDoc(tax);
  }

  async delete(id: string): Promise<ClientTax> {
    return this.db.deleteDoc(id);
  }
}
