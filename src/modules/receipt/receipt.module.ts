import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ReceiptController } from '.';
import { AddReceipt, AddReceipts, DeleteReceipt, GetReceipt, QueryReceipts, UpdateReceipt } from './application';
import {
  ETA_RECEIPT_PROCESSOR_PROVIDER,
  ETA_RECEIPT_QUEUE_PROVIDER,
  RECEIPT_REPOSITORY_PROVIDER,
  RECEIPT_SERVICE_PROVIDER,
  RECEIPT_USECASE_PROVIDERS,
} from './domain';
import { ReceiptFirestoreRepository, ReceiptService } from './infrastructure';
import { EtaEReceiptProcessor } from './infrastructure/processors';

import { CODE_REPOSITORY_PROVIDER, CODE_SERVICE_PROVIDER } from '../code/domain';
import { CodeFirestoreRepository, CodeService } from '../code/infrastructure';

const paymentUsecases = [
  {
    provide: RECEIPT_USECASE_PROVIDERS.GET_RECEIPT,
    useClass: GetReceipt,
  },
  {
    provide: RECEIPT_USECASE_PROVIDERS.ADD_RECEIPT,
    useClass: AddReceipt,
  },
  {
    provide: RECEIPT_USECASE_PROVIDERS.ADD_RECEIPTS,
    useClass: AddReceipts,
  },
  {
    provide: RECEIPT_USECASE_PROVIDERS.UPDATE_RECEIPT,
    useClass: UpdateReceipt,
  },
  {
    provide: RECEIPT_USECASE_PROVIDERS.QUERY_RECEIPTS,
    useClass: QueryReceipts,
  },
  {
    provide: RECEIPT_USECASE_PROVIDERS.DELETE_RECEIPT,
    useClass: DeleteReceipt,
  },
];

const providers = [
  {
    provide: RECEIPT_REPOSITORY_PROVIDER,
    useClass: ReceiptFirestoreRepository,
  },
  {
    provide: RECEIPT_SERVICE_PROVIDER,
    useClass: ReceiptService,
  },
  {
    provide: CODE_REPOSITORY_PROVIDER,
    useClass: CodeFirestoreRepository,
  },
  {
    provide: CODE_SERVICE_PROVIDER,
    useClass: CodeService,
  },
  // {
  //   provide: ETA_E_RECEIPT_PROVIDER,
  //   useClass: EtaEReceiptService,
  // },
  {
    provide: ETA_RECEIPT_PROCESSOR_PROVIDER,
    useClass: EtaEReceiptProcessor,
  },
];

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: ETA_RECEIPT_QUEUE_PROVIDER,
    }),
  ],
  controllers: [ReceiptController],
  providers: [...providers, ...paymentUsecases],
  exports: [
    {
      provide: RECEIPT_SERVICE_PROVIDER,
      useClass: ReceiptService,
    },
  ],
})
export class ReceiptModule {}
