import { Inject, Injectable } from '@nestjs/common';

import { ISubscriptionUsageRepository, ISubscriptionUsageService, SUBSCRIPTION_USAGE_REPOSITORY_PROVIDER, Usage } from '../../domain';

@Injectable()
export class SubscriptionUsageService implements ISubscriptionUsageService {
  constructor(
    @Inject(SUBSCRIPTION_USAGE_REPOSITORY_PROVIDER)
    private readonly usageRepo: ISubscriptionUsageRepository,
  ) {}

  async getUsage(subscriptionId: string): Promise<Usage[]> {
    return this.usageRepo.getMany(subscriptionId);
  }

  async addUsage(usage: Partial<Usage>[], subscriptionId: string): Promise<Usage[]> {
    return this.usageRepo.addMany(usage, subscriptionId);
  }

  async updateUsage(usage: Partial<Usage> & { id: string }, subscriptionId: string): Promise<Usage> {
    return this.usageRepo.update(usage, subscriptionId);
  }
}
