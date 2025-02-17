import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PAYPAL_CONFIGS_PROVIDER, PAYPAL_PROVIDER } from '../../constants';
import { PaypalConfigs } from './paypal.config';
import { PaypalService } from './paypal.service';

@Module({})
export class PaypalModule {
  /**
   * Creates a dynamic module for the Paypal integration using the provided configurations.
   *
   * @param {PaypalConfigs} configs - The configurations for the Paypal integration.
   * @return {DynamicModule} The created dynamic module for the Paypal integration.
   */
  static forRoot(configs: PaypalConfigs): DynamicModule {
    const configsProvider: Provider = {
      provide: PAYPAL_CONFIGS_PROVIDER,
      useFactory: () => configs,
    };

    const paypalProvider: Provider = {
      provide: PAYPAL_PROVIDER,
      useClass: PaypalService,
    };

    return {
      global: true,
      providers: [configsProvider, paypalProvider],
      exports: [paypalProvider],
      module: PaypalModule,
    };
  }
}
