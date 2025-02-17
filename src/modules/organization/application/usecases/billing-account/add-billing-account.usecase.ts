import { Inject, Injectable } from '@nestjs/common';

import { BadRequestException } from '../../../../../core/exceptions';
import { Usecase } from '../../../../../core/interfaces';

import { BILLING_ACCOUNT_SERVICE_PROVIDER, BillingAccount, IBillingAccountService } from '../../../domain';

@Injectable()
export class AddBillingAccount implements Usecase<BillingAccount> {
  constructor(
    @Inject(BILLING_ACCOUNT_SERVICE_PROVIDER)
    private readonly billingService: IBillingAccountService,
  ) {}

  async execute(account: Partial<BillingAccount> & { organizationId: string }): Promise<BillingAccount> {
    // Validate the account
    const accounts = await this.billingService.getBillingAccounts(account.organizationId, [{ key: 'gateway', operator: 'eq', value: account.gateway }]);

    if (accounts.length) {
      throw new BadRequestException(`Billing account with gateway "${account.gateway}" already exists!`);
    }

    return this.billingService.addBillingAccount(account);
  }
}
