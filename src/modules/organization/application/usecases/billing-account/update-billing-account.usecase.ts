import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { BILLING_ACCOUNT_SERVICE_PROVIDER, BillingAccount, IBillingAccountService } from '../../../domain';

@Injectable()
export class UpdateBillingAccount implements Usecase<BillingAccount> {
  constructor(
    @Inject(BILLING_ACCOUNT_SERVICE_PROVIDER)
    private readonly billingService: IBillingAccountService,
  ) {}

  async execute(account: Partial<BillingAccount> & { id: string }): Promise<BillingAccount> {
    return this.billingService.updateBillingAccount(account);
  }
}
