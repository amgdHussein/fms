import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AddPlan, GetPlan, GetPlans, UpdatePlan } from '../../application';
import { SUBSCRIPTION_PLAN_USECASE_PROVIDERS } from '../../domain';
import { AddPlanDto, PlanDto, UpdatePlanDto } from '../dtos';

//TODO: ADD GUARD TO PROTECT ROUTES FROM UNAUTHORIZED ACCESS

@ApiTags('Subscription Plans')
@Controller('subscription/plans')
export class SubscriptionPlanController {
  constructor(
    @Inject(SUBSCRIPTION_PLAN_USECASE_PROVIDERS.ADD_SUBSCRIPTION_PLAN)
    private readonly addPlanUsecase: AddPlan,

    @Inject(SUBSCRIPTION_PLAN_USECASE_PROVIDERS.UPDATE_SUBSCRIPTION_PLAN)
    private readonly updatePlanUsecase: UpdatePlan,

    @Inject(SUBSCRIPTION_PLAN_USECASE_PROVIDERS.GET_SUBSCRIPTION_PLANS)
    private readonly getPlansUsecase: GetPlans,

    @Inject(SUBSCRIPTION_PLAN_USECASE_PROVIDERS.GET_SUBSCRIPTION_PLAN)
    private readonly getPlanUsecase: GetPlan,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a subscription plan by its unique ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'a158sd4a8ad4a8',
    required: true,
    description: 'The unique identifier of the subscription plan.',
  })
  @ApiResponse({
    type: PlanDto,
    description: 'The subscription plan details for the provided ID.',
  })
  async getPlan(@Param('id') id: string): Promise<PlanDto> {
    return this.getPlanUsecase.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all available subscription plans.' })
  @ApiResponse({
    type: [PlanDto],
    description: 'A list of all available subscription plans.',
  })
  async getPlans(): Promise<PlanDto[]> {
    return this.getPlansUsecase.execute();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new subscription plan.' })
  @ApiBody({
    type: AddPlanDto,
    required: true,
    description: 'Details of the new subscription plan to be created.',
  })
  @ApiResponse({
    type: PlanDto,
    description: 'The newly created subscription plan.',
  })
  async addPlan(@Body() dto: AddPlanDto): Promise<PlanDto> {
    return this.addPlanUsecase.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing subscription plan.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: '12345',
    required: true,
    description: 'The unique identifier of the subscription plan.',
  })
  @ApiBody({
    type: UpdatePlanDto,
    required: true,
    description: 'Details of the subscription plan to be updated.',
  })
  @ApiResponse({
    type: PlanDto,
    description: 'The updated subscription plan details.',
  })
  async updatePlan(@Param('id') id: string, @Body() entity: UpdatePlanDto): Promise<PlanDto> {
    return this.updatePlanUsecase.execute({ ...entity, id });
  }
}
