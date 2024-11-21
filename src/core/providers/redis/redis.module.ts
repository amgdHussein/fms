import { DynamicModule, Module, Provider } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { REDIS_PROVIDER } from '../../constants';

import { RedisConfigs } from './redis.config';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  /**
   * Create a DynamicModule for the CacheModule with the given options.
   * @param {RedisConfigs} configs - the options for connecting to Redis
   * @return {DynamicModule} the created DynamicModule for CacheModule
   */
  static forRoot(configs: RedisConfigs): DynamicModule {
    const redisProvider: Provider = {
      provide: REDIS_PROVIDER,
      useClass: RedisService,
    };

    return {
      global: true,

      imports: [
        CacheModule.register({
          store: redisStore,
          host: configs.host,
          port: configs.port,
        }),
      ],
      providers: [redisProvider],
      exports: [redisProvider],
      module: RedisModule,
    };
  }
}
