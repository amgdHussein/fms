import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BadRequestException } from '../../../../core/exceptions';
import { AddSubscription, CancelSubscription, GetOrganizationSubscription, GetSubscription, StartFreeTrialSubscription } from '../../application';
import { SUBSCRIPTION_USECASE_PROVIDERS } from '../../domain';
import { AddSubscriptionDto, SubscriptionDto } from '../dtos';

@ApiTags('Subscriptions')
@Controller()
export class SubscriptionController {
  constructor(
    @Inject(SUBSCRIPTION_USECASE_PROVIDERS.ADD_SUBSCRIPTION)
    private readonly addSubscriptionUsecase: AddSubscription,

    @Inject(SUBSCRIPTION_USECASE_PROVIDERS.GET_SUBSCRIPTION)
    private readonly getSubscriptionUsecase: GetSubscription,

    @Inject(SUBSCRIPTION_USECASE_PROVIDERS.GET_ORGANIZATION_SUBSCRIPTION)
    private readonly getOrganizationSubscriptionUsecase: GetOrganizationSubscription,

    @Inject(SUBSCRIPTION_USECASE_PROVIDERS.CANCELED_SUBSCRIPTION)
    private readonly cancelSubscriptionUsecase: CancelSubscription,

    @Inject(SUBSCRIPTION_USECASE_PROVIDERS.START_FREE_TRIAL_SUBSCRIPTION)
    private readonly startFreeTrialSubscription: StartFreeTrialSubscription,
  ) {}

  // TODO: ADD GET ALL SUBSCRIPTIONS FRO ADMIN

  @Get('subscriptions/:id')
  @ApiOperation({ summary: 'Retrieve a subscription by its unique ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'abc123',
    required: true,
    description: 'The unique identifier of the subscription.',
  })
  @ApiResponse({
    type: SubscriptionDto,
    description: 'The subscription details for the provided ID.',
  })
  async getSubscription(@Param('id') id: string): Promise<SubscriptionDto> {
    return this.getSubscriptionUsecase.execute(id);
  }

  //TODO: THINK OF change this to change subscription
  @Post('subscriptions/change-plan')
  @ApiOperation({ summary: 'Create a new subscription.' })
  @ApiBody({
    type: AddSubscriptionDto,
    required: true,
    description: 'Details of the new subscription to be created.',
  })
  @ApiResponse({
    type: SubscriptionDto,
    description: 'The newly created subscription.',
  })
  async addSubscription(@Body() dto: any): Promise<SubscriptionDto> {
    //TODO: ADD DTO
    return this.addSubscriptionUsecase.execute(dto);
  }

  //TODO: REMOVE THIS AS ITS USED FROM ORGANIZATION MODULE, WE USE IT NOW FRO TESTING ONLY
  @Post('organizations/:organizationId/subscriptions/start/freeTrial')
  async startFreeTrial(@Param('organizationId') organizationId: string): Promise<SubscriptionDto> {
    try {
      return await this.startFreeTrialSubscription.execute(organizationId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('subscriptions/:id')
  @ApiOperation({ summary: 'Cancel an existing subscription.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'abc123',
    required: true,
    description: 'The unique identifier of the subscription to be canceled.',
  })
  @ApiResponse({
    type: SubscriptionDto,
    description: 'The details of the canceled subscription.',
  })
  async cancelSubscription(@Param('id') id: string): Promise<SubscriptionDto> {
    return this.cancelSubscriptionUsecase.execute(id);
  }

  //TODO: FIX THIS MAKE IF RETURN THE SUBSCRIBTION OF THE INVOICE
  @Get('organizations/:organizationId/subscriptions')
  @ApiOperation({ summary: 'Retrieve the latest subscription for a specific organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'org456',
    required: true,
    description: 'The unique identifier of the organization whose subscriptions should be retrieved.',
  })
  @ApiResponse({
    type: SubscriptionDto,
    description: 'The latest subscription associated with the specified organization.',
  })
  async getOrganizationSubscription(@Param('organizationId') organizationId: string): Promise<SubscriptionDto> {
    return this.getOrganizationSubscriptionUsecase.execute(organizationId);
  }
}
