import { DynamicModule, Module, Provider } from '@nestjs/common';

import { ETA_COMMON_PROVIDER, ETA_CONFIGS_PROVIDER, ETA_E_INVOICING_PROVIDER, ETA_PROVIDER } from '../../constants';

import { EtaCommonService } from './eta-common.service';
import { EtaEInvoicingService } from './eta-einvoicing.service';
import { EtaConfigs } from './eta.config';
import { EtaService } from './eta.service';

@Module({})
export class EtaModule {
  static forRoot(configs: EtaConfigs): DynamicModule {
    const configsProvider: Provider = {
      provide: ETA_CONFIGS_PROVIDER,
      useFactory: () => configs,
    };

    const etaServiceProvider: Provider = {
      provide: ETA_PROVIDER,
      useClass: EtaService,
    };

    const invoiceServiceProvider: Provider = {
      provide: ETA_E_INVOICING_PROVIDER,
      useClass: EtaEInvoicingService,
    };

    const commonServiceProvider: Provider = {
      provide: ETA_COMMON_PROVIDER,
      useClass: EtaCommonService,
    };

    const targetModule: DynamicModule = {
      global: true,
      providers: [configsProvider, etaServiceProvider, commonServiceProvider, invoiceServiceProvider],
      exports: [etaServiceProvider, commonServiceProvider, invoiceServiceProvider],
      module: EtaModule,
    };

    return targetModule;
  }
}
