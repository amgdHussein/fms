import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../core/interfaces/usecase.interface';
import { IReceiptService, Receipt, RECEIPT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class UpdateReceipt implements Usecase<Receipt> {
  constructor(
    @Inject(RECEIPT_SERVICE_PROVIDER)
    private readonly receiptService: IReceiptService,
  ) {}

  async execute(receipt: Partial<Receipt> & { id: string }): Promise<Receipt> {
    return this.receiptService.updateReceipt(receipt);
  }
}
