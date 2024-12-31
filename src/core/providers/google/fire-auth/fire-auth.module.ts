import { DynamicModule, Module, Provider } from '@nestjs/common';

import { FIRE_AUTH_CONFIGS_PROVIDER, FIRE_AUTH_PROVIDER } from '../../../constants';

import { FireAuthConfigs } from './fire-auth.config';
import { FireAuthService } from './fire-auth.service';

@Module({})
export class FireAuthModule {
  /**
   * Create a DynamicModule for the FireAuthModule with the provided configurations.
   *
   * @param {FireAuthConfigs} configs - the configurations for the FireAuthModule
   * @return {DynamicModule} the created DynamicModule for the FireAuthModule
   */
  static forRoot(configs: FireAuthConfigs): DynamicModule {
    const configsProvider: Provider = {
      provide: FIRE_AUTH_CONFIGS_PROVIDER,
      useFactory: () => configs,
    };

    const fireAuthProvider: Provider = {
      provide: FIRE_AUTH_PROVIDER,
      useClass: FireAuthService,
    };

    const targetModule: DynamicModule = {
      global: true,
      providers: [configsProvider, fireAuthProvider],
      exports: [configsProvider, fireAuthProvider],
      module: FireAuthModule,
    };

    return targetModule;
  }
}
