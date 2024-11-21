import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ETA_CONFIGS_PROVIDER, ETA_PROVIDER, HTTP_PROVIDER } from '../../constants';

import { EtaConfigs } from './eta.config';
import { EtaService } from './eta.service';

@Injectable()
export class EtaEInvoicingService {
  private readonly logger = new Logger(EtaEInvoicingService.name);

  constructor(
    @Inject(ETA_PROVIDER)
    private readonly eta: EtaService,

    @Inject(ETA_CONFIGS_PROVIDER)
    private readonly configs: EtaConfigs,

    @Inject(HTTP_PROVIDER)
    private readonly http: HttpService,
  ) {}
}
