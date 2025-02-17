import { DynamicModule, Module, Provider } from '@nestjs/common';

import { EASY_KASH_CONFIGS_PROVIDER, EASY_KASH_PROVIDER } from '../../constants';
import { EasyKashConfigs } from './easykash.config';
import { EasyKashService } from './easykash.service';

@Module({})
export class EasyKashModule {
  /**
   * Creates a dynamic module for the EasyKash integration using the provided configurations.
   *
   * @param {EasyKashConfigs} configs - The configurations for the EasyKash integration.
   * @return {DynamicModule} The created dynamic module for the EasyKash integration.
   */
  static forRoot(configs: EasyKashConfigs): DynamicModule {
    const configsProvider: Provider = {
      provide: EASY_KASH_CONFIGS_PROVIDER,
      useFactory: () => configs,
    };

    const paypalProvider: Provider = {
      provide: EASY_KASH_PROVIDER,
      useClass: EasyKashService,
    };

    return {
      global: true,
      providers: [configsProvider, paypalProvider],
      exports: [paypalProvider],
      module: EasyKashModule,
    };
  }
}
