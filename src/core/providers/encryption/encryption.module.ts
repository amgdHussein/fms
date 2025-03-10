import { DynamicModule, Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

@Module({})
export class EncryptionModule {
  static forRoot(): DynamicModule {
    const targetModule: DynamicModule = {
      global: true,
      providers: [EncryptionService],
      exports: [EncryptionService],
      module: EncryptionModule,
    };

    return targetModule;
  }
}
