import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as Joi from 'joi';

import { EventEmitterModule, HttpModule, RedisModule } from './core/providers';

@Module({
  imports: [
    // ? Nest Modules

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/env/${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
      }),
    }),

    BullModule.forRoot({
      redis: {
        host: process.env.REDISHOST,
        port: +process.env.REDISPORT,
      },
    }),

    // ? Core Modules

    HttpModule.forRoot({
      useFactory: () => ({
        timeout: +process.env.HTTP_TIMEOUT,
        maxRedirects: +process.env.HTTP_MAX_REDIRECTS,
      }),
    }),

    EventEmitterModule.forRoot({
      delimiter: '.',
      maxListeners: 10,
    }),

    RedisModule.forRoot({
      host: process.env.REDISHOST,
      port: +process.env.REDISPORT,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
