import { Global, Module } from '@nestjs/common';

import { AddCodes, DraftCode, GetCode, GetCodes, ImportCodes, IsCodeExistConstraint, ReuseCodes, UpdateCode } from './application';
import { CODE_REPOSITORY_PROVIDER, CODE_SERVICE_PROVIDER, CODE_USECASE_PROVIDERS, ETA_CODE_USECASE_PROVIDERS } from './domain';
import { CodeFirestoreRepository, CodeService } from './infrastructure';
import { CodeController, EtaCodeController } from './presentation';

const validators = [IsCodeExistConstraint];

const codeUsecases = [
  {
    provide: CODE_USECASE_PROVIDERS.GET_CODE,
    useClass: GetCode,
  },
  {
    provide: CODE_USECASE_PROVIDERS.GET_CODES,
    useClass: GetCodes,
  },
  {
    provide: CODE_USECASE_PROVIDERS.DRAFT_CODE,
    useClass: DraftCode,
  },
];

const etaCodeUsecases = [
  {
    provide: ETA_CODE_USECASE_PROVIDERS.ADD_CODES,
    useClass: AddCodes,
  },
  {
    provide: ETA_CODE_USECASE_PROVIDERS.IMPORT_CODES,
    useClass: ImportCodes,
  },
  {
    provide: ETA_CODE_USECASE_PROVIDERS.UPDATE_CODE,
    useClass: UpdateCode,
  },
  {
    provide: ETA_CODE_USECASE_PROVIDERS.REUSE_CODES,
    useClass: ReuseCodes,
  },
];

@Global()
@Module({
  controllers: [CodeController, EtaCodeController],
  providers: [
    ...validators,

    {
      provide: CODE_REPOSITORY_PROVIDER,
      useClass: CodeFirestoreRepository,
    },
    {
      provide: CODE_SERVICE_PROVIDER,
      useClass: CodeService,
    },

    ...codeUsecases,
    ...etaCodeUsecases,
  ],
  exports: [
    {
      provide: CODE_SERVICE_PROVIDER,
      useClass: CodeService,
    },
  ],
})
export class CodeModule {}
