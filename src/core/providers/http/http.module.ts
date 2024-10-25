import { HttpModuleAsyncOptions, HttpService, HttpModule as NestHttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';

import { HTTP_PROVIDER } from '../../constants';

@Module({})
export class HttpModule {
  static forRoot(options: HttpModuleAsyncOptions): DynamicModule {
    const httpProvider: Provider = {
      provide: HTTP_PROVIDER,
      useFactory: (): HttpService => new HttpService(),
    };

    const targetModule: DynamicModule = {
      imports: [NestHttpModule.registerAsync(options)],
      providers: [httpProvider],
      exports: [httpProvider],
      global: true,
      module: HttpModule,
    };

    return targetModule;
  }
}
