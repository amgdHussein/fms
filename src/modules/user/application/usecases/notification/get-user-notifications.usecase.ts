import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IUserNotificationService, Notification, USER_NOTIFICATION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetUserNotifications implements Usecase<Notification> {
  constructor(
    @Inject(USER_NOTIFICATION_SERVICE_PROVIDER)
    private readonly userNotificationService: IUserNotificationService,
  ) {}

  async execute(userId: string): Promise<Notification[]> {
    return this.userNotificationService.getNotifications(userId);
  }
}
