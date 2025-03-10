import { DynamicModule, Module, Provider } from '@nestjs/common';

import { ENCRYPTION_PROVIDER } from '../../constants';

import { EncryptionConfigs } from './encryption.config';
import { EncryptionService } from './encryption.service';

@Module({})
export class EncryptionModule {
  static forRoot(configs: EncryptionConfigs): DynamicModule {
    const encryptionProvider: Provider = {
      provide: ENCRYPTION_PROVIDER,
      useFactory: () => new EncryptionService(configs),
    };

    const targetModule: DynamicModule = {
      global: true,
      providers: [encryptionProvider],
      exports: [encryptionProvider],
      module: EncryptionModule,
    };

    return targetModule;
  }
}
