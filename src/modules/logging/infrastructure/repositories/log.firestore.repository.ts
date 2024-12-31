import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService } from '../../../../core/providers';

import { ILogRepository, Log } from '../../domain';

@Injectable()
export class LogFirestoreRepository implements ILogRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.LOGS)
    private readonly db: FirestoreService<Log>,
  ) {}

  async getMany(filters?: QueryFilter[], page?: number, limit?: number): Promise<Log[]> {
    return this.db.getDocs(filters, page, limit, { key: 'createdAt', dir: 'desc' });
  }

  async get(id: string): Promise<Log> {
    return this.db.getDoc(id);
  }

  async add(log: Partial<Log>): Promise<Log> {
    return this.db.addDoc({
      ...log,
      createdBy: this.authService.currentUser.uid,
      createdAt: Date.now(),
      updatedBy: this.authService.currentUser.uid,
      updatedAt: Date.now(),
    });
  }

  async update(log: Partial<Log> & { id: string }): Promise<Log> {
    return this.db.updateDoc({
      ...log,
      updatedBy: this.authService.currentUser.uid,
      updatedAt: Date.now(),
    });
  }

  async delete(id: string): Promise<Log> {
    return this.db.deleteDoc(id);
  }
}
