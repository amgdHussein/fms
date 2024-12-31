import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService } from '../../../../core/providers';

import { Event, IEventRepository } from '../../domain';

@Injectable()
export class EventFirestoreRepository implements IEventRepository {
  constructor(
    @Inject(FIRESTORE_COLLECTION_PROVIDERS.LOGS)
    private readonly db: FirestoreService<Event>,
  ) {}

  async getMany(filters?: QueryFilter[], page?: number, limit?: number): Promise<Event[]> {
    return this.db.getDocs(filters, page, limit, { key: 'createdAt', dir: 'desc' });
  }

  async get(id: string): Promise<Event> {
    return this.db.getDoc(id);
  }

  async add(event: Partial<Event>): Promise<Event> {
    return this.db.addDoc({
      ...event,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  async update(event: Partial<Event> & { id: string }): Promise<Event> {
    return this.db.updateDoc({
      ...event,
      updatedAt: Date.now(),
    });
  }

  async delete(id: string): Promise<Event> {
    return this.db.deleteDoc(id);
  }
}
