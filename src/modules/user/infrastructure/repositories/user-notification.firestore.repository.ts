import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { QueryFilter } from '../../../../core/models';
import { IUserNotificationRepository, Notification, User } from '../../domain';

@Injectable()
export class UserNotificationFirestoreRepository implements IUserNotificationRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.USERS)
    private readonly db: FirestoreService<User>,
  ) {}

  private notificationFirestore(userId: string): FirestoreService<Notification> {
    return this.db.nestedCollection<Notification>(userId, 'notifications');
  }

  async get(id: string, userId: string): Promise<Notification> {
    return this.notificationFirestore(userId).getDoc(id);
  }

  async getMany(userId: string, filters?: QueryFilter[], page?: number, limit?: number): Promise<Notification[]> {
    return this.notificationFirestore(userId).getDocs(filters, page, limit, { key: 'createdAt', dir: 'desc' });
  }

  async add(notification: Partial<Notification>, userId: string): Promise<Notification> {
    return this.notificationFirestore(userId).addDoc({
      ...notification,
      userId,
      createdBy: this.authService.currentUser.uid,
      createdAt: Date.now(),
      updatedBy: this.authService.currentUser.uid,
      updatedAt: Date.now(),
    });
  }

  async update(notification: Partial<Notification> & { id: string }, userId: string): Promise<Notification> {
    return this.notificationFirestore(userId).updateDoc({
      ...notification,
      updatedBy: this.authService.currentUser.uid,
      updatedAt: Date.now(),
    });
  }

  async updateMany(userId: string, notifications: (Partial<Notification> & { id: string })[]): Promise<Notification[]> {
    notifications.forEach(notification => {
      notification.updatedBy = this.authService.currentUser.uid;
      notification.updatedAt = Date.now();
    });

    return this.notificationFirestore(userId).updateDocs(notifications);
  }

  async delete(id: string, userId: string): Promise<Notification> {
    return this.notificationFirestore(userId).deleteDoc(id);
  }
}
