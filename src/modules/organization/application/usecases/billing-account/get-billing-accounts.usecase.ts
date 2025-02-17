import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { BILLING_ACCOUNT_SERVICE_PROVIDER, BillingAccount, IBillingAccountService } from '../../../domain';

@Injectable()
export class GetBillingAccounts implements Usecase<BillingAccount> {
  constructor(
    @Inject(BILLING_ACCOUNT_SERVICE_PROVIDER)
    private readonly billingService: IBillingAccountService,
  ) {}

  async execute(organizationId: string): Promise<BillingAccount[]> {
    return this.billingService.getBillingAccounts(organizationId);
  }
}
