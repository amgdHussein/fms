import { DynamicModule, Module, Provider } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { PAY_TABS_PROVIDER } from '../../constants';
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
    const payTabsProvider: Provider = {
      provide: PAY_TABS_PROVIDER,
      // inject: [HTTP_PROVIDER],
      useFactory: (httpService: HttpService) => {
        // Added arrow function =>
        return new PayTabsService(configs, httpService); //TODO: FIX HTTP INJECTION
      },
    };

    return {
      global: true,
      providers: [payTabsProvider],
      exports: [payTabsProvider],
      module: PayTabsModule,
    };
  }
}
