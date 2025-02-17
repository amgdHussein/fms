import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PAY_TABS_CONFIGS_PROVIDER, PAY_TABS_PROVIDER } from '../../constants';
import { PayTabsConfigs } from './paytabs.config';
import { PayTabsService } from './paytabs.service';

@Module({})
export class PayTabsModule {
  /**
   * Creates a dynamic module for the PayTabs integration using the provided configurations.
   *
   * @param {PayTabsConfigs} configs - The configurations for the PayTabs integration.
   * @return {DynamicModule} The created dynamic module for the PayTabs integration.
   */
  static forRoot(configs: PayTabsConfigs): DynamicModule {
    const configsProvider: Provider = {
      provide: PAY_TABS_CONFIGS_PROVIDER,
      useFactory: () => configs,
    };

    const payTabsProvider: Provider = {
      provide: PAY_TABS_PROVIDER,
      useClass: PayTabsService,
    };

    return {
      global: true,
      providers: [configsProvider, payTabsProvider],
      exports: [payTabsProvider],
      module: PayTabsModule,
    };
  }
}
