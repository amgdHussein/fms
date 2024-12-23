import { Module } from '@nestjs/common';

import { OrganizationModule } from '../organization/organization.module';
import { AddCodes, DraftCode, GetCode, GetCodes, ImportCodes, IsCodeExistConstraint, ReuseCodes, UpdateCode } from './application';
import { CODE_REPOSITORY_PROVIDER, CODE_SERVICE_PROVIDER, CODE_USECASE_PROVIDERS } from './domain';
import { CodeFirestoreRepository, CodeService } from './infrastructure';
import { CodeController } from './presentation';

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
  {
    provide: CODE_USECASE_PROVIDERS.ADD_CODES,
    useClass: AddCodes,
  },
  {
    provide: CODE_USECASE_PROVIDERS.IMPORT_CODES,
    useClass: ImportCodes,
  },
  {
    provide: CODE_USECASE_PROVIDERS.UPDATE_CODE,
    useClass: UpdateCode,
  },
  {
    provide: CODE_USECASE_PROVIDERS.REUSE_CODES,
    useClass: ReuseCodes,
  },
];

@Module({
  imports: [OrganizationModule],
  controllers: [CodeController],
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
  ],
  exports: [
    {
      provide: CODE_SERVICE_PROVIDER,
      useClass: CodeService,
    },
  ],
})
export class CodeModule {}
