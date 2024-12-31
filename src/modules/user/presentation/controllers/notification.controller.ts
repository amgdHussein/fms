import { Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUserNotifications, MarkAllAsRead, MarkNotificationAsRead, MarkNotificationAsUnread } from '../../application';
import { USER_NOTIFICATION_USECASE_PROVIDERS } from '../../domain';

import { UserNotificationDto } from '../dtos';

@ApiTags('User Notifications')
@Controller('users')
export class UserNotificationController {
  constructor(
    @Inject(USER_NOTIFICATION_USECASE_PROVIDERS.GET_USER_NOTIFICATIONS)
    private readonly getUserNotificationsUsecase: GetUserNotifications,

    @Inject(USER_NOTIFICATION_USECASE_PROVIDERS.MARK_ALL_AS_READ)
    private readonly markAsUnread: MarkNotificationAsUnread,

    @Inject(USER_NOTIFICATION_USECASE_PROVIDERS.MARK_AS_READ)
    private readonly markAsRead: MarkNotificationAsRead,

    @Inject(USER_NOTIFICATION_USECASE_PROVIDERS.MARK_AS_UNREAD)
    private readonly markAllAsRead: MarkAllAsRead,
  ) {}

  @Get(':userId/notifications')
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    example: '12345',
    description: 'The unique identifier of the user.',
  })
  @ApiOperation({ summary: 'Retrieve all notifications for a user.' })
  @ApiResponse({
    type: [UserNotificationDto],
    description: 'Returns the list of notifications for the specified user.',
  })
  async getNotifications(@Param('userId') userId: string): Promise<UserNotificationDto[]> {
    return this.getUserNotificationsUsecase.execute(userId);
  }

  @Patch(':userId/notifications/:notificationId/read')
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    example: '12345',
    description: 'The unique identifier of the user.',
  })
  @ApiParam({
    name: 'notificationId',
    type: String,
    required: true,
    example: 'notif-6789',
    description: 'The unique identifier of the notification.',
  })
  @ApiOperation({ summary: 'Mark a specific notification as read.' })
  @ApiResponse({
    type: UserNotificationDto,
    description: 'Returns the updated notification marked as read.',
  })
  async markNotificationAsRead(@Param('userId') userId: string, @Param('notificationId') notificationId: string): Promise<UserNotificationDto> {
    return this.markAsRead.execute(userId, notificationId);
  }

  @Patch(':userId/notifications/:notificationId/unread')
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    example: '12345',
    description: 'The unique identifier of the user.',
  })
  @ApiParam({
    name: 'notificationId',
    type: String,
    required: true,
    example: 'notif-6789',
    description: 'The unique identifier of the notification.',
  })
  @ApiOperation({ summary: 'Mark a specific notification as unread.' })
  @ApiResponse({
    type: UserNotificationDto,
    description: 'Returns the updated notification marked as unread.',
  })
  async markNotificationAsUnread(@Param('userId') userId: string, @Param('notificationId') notificationId: string): Promise<UserNotificationDto> {
    return this.markAsUnread.execute(userId, notificationId);
  }

  @Patch(':userId/notifications/read-all')
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    example: '12345',
    description: 'The unique identifier of the user.',
  })
  @ApiOperation({ summary: 'Mark all notifications for a user as read.' })
  @ApiResponse({
    type: [UserNotificationDto],
    description: 'Returns the list of notifications marked as read.',
  })
  async markNotificationsAsRead(@Param('userId') userId: string): Promise<UserNotificationDto[]> {
    return this.markAllAsRead.execute(userId);
  }
}
