import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as Joi from 'joi';

import { AuthModule } from './core/auth';
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
        REDISHOST: Joi.string().required(),
        REDISPORT: Joi.number().required(),
        HTTP_TIMEOUT: Joi.number().default(5000),
        HTTP_MAX_REDIRECTS: Joi.number().default(5),
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

    AuthModule.forRoot({
      projectId: process.env.GCLOUD_PROJECT_ID,
      clientEmail: process.env.GCLOUD_CLIENT_EMAIL,
      privateKey: process.env.GCLOUD_PRIVATE_KEY,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
