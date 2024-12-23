import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { QueryFilter } from '../../../../core/models';
import { Organization } from '../../../organization/domain';
import { Code, ICodeRepository } from '../../domain';

@Injectable()
export class CodeFirestoreRepository implements ICodeRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ORGANIZATIONS)
    private readonly db: FirestoreService<Organization>,
  ) {}

  private codeFirestore(organizationId: string): FirestoreService<Code> {
    return this.db.nestedCollection<Code>(organizationId, 'codes');
  }

  async get(id: string, organizationId: string): Promise<Code> {
    return this.codeFirestore(organizationId).getDoc(id);
  }

  async getMany(organizationId: string, filters?: QueryFilter[]): Promise<Code[]> {
    return this.codeFirestore(organizationId).getDocs(filters);
  }

  async add(code: Partial<Code>, organizationId: string): Promise<Code> {
    // Initiate some fields
    code.createdBy = this.locker.user.uid;
    code.createdAt = Date.now();
    code.updatedBy = this.locker.user.uid;
    code.updatedAt = Date.now();
    code.organizationId = organizationId;

    return this.codeFirestore(organizationId).addDoc(code);
  }

  async addMany(codes: Partial<Code>[], organizationId: string): Promise<Code[]> {
    codes.forEach(code => {
      // Initiate some fields
      code.createdBy = this.locker.user.uid;
      code.createdAt = Date.now();
      code.updatedBy = this.locker.user.uid;
      code.updatedAt = Date.now();
    });

    return this.codeFirestore(organizationId).addDocs(codes);
  }

  async update(code: Partial<Code> & { id: string }, organizationId: string): Promise<Code> {
    // Update some fields
    code.updatedBy = this.locker.user.uid;
    code.updatedAt = Date.now();

    return this.codeFirestore(organizationId).updateDoc(code);
  }

  async delete(id: string, organizationId: string): Promise<Code> {
    return this.codeFirestore(organizationId).deleteDoc(id);
  }
}
