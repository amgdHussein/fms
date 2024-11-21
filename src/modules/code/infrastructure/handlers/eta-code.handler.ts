import { Inject, Logger } from '@nestjs/common';

import { ETA_COMMON_PROVIDER } from '../../../../core/constants';
import { EtaCommonService } from '../../../../core/providers';

import { IOrganizationService, ORGANIZATION_SERVICE_PROVIDER } from '../../../organization/domain';
import { CODE_SERVICE_PROVIDER, ICodeService } from '../../domain';

export class EtaCodeHandler {
  private readonly logger = new Logger(EtaCodeHandler.name);

  constructor(
    @Inject(ETA_COMMON_PROVIDER)
    private readonly etaCommon: EtaCommonService,

    @Inject(CODE_SERVICE_PROVIDER)
    private readonly codeService: ICodeService,

    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly orgService: IOrganizationService,
  ) {}
}
