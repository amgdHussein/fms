import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ClsModule, ClsModuleOptions } from 'nestjs-cls';

import { LOCKER_PROVIDER } from '../../constants';

import { LockerService } from './locker.service';

@Module({})
export class LockerModule {
  /**
   * Create a DynamicModule for the CacheModule with the given options.
   * @param {LockerConfigs} options - the options for connecting to Locker
   * @return {DynamicModule} the created DynamicModule for CacheModule
   */
  static forRoot(options: ClsModuleOptions): DynamicModule {
    const lockerProvider: Provider = {
      provide: LOCKER_PROVIDER,
      useClass: LockerService,
    };

    return {
      global: true,
      imports: [ClsModule.forRoot(options)],
      providers: [lockerProvider],
      exports: [lockerProvider],
      module: LockerModule,
    };
  }
}
