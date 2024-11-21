import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtConfigs } from './jwt.config';

@Module({})
export class AppJwtModule {
  static forRoot(configs: JwtConfigs): DynamicModule {
    const providers: Provider[] = configs.providers.map(
      (providerName: string, index: number): Provider => ({
        provide: providerName,
        useFactory: (): JwtService => {
          return new JwtService({
            secret: configs.secrets[index],
          });
        },
      }),
    );

    // TODO: PROVIDE THE MAIN JWT SERVICE

    const targetModule: DynamicModule = {
      global: true,
      module: AppJwtModule,
      providers: [...providers],
      exports: [...providers],
    };

    return targetModule;
  }
}
