import { BullModule } from '@nestjs/bull';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import * as Joi from 'joi';

import { AuthModule } from './core/auth';
import { ExceptionFilter } from './core/filters';
import { LoggingInterceptor } from './core/interceptors';
import { CloudTasksModule, EtaModule, EventEmitterModule, FirestoreModule, HttpModule, LockerModule, RedisModule } from './core/providers';

import { AccountModule, ClientModule, CodeModule, OrganizationModule, UserModule } from './modules';

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

    LockerModule.forRoot({
      global: true,
      interceptor: {
        mount: true, // Automatically mount the ClsMiddleware for all routes
        // Use the setup method to provide default store values
        setup: (cls, req) => {
          const ctx = req.switchToHttp().getRequest();
          cls.set('user', ctx.user);
          cls.set('environment', process.env.APP_ENV);
        },
      },
    }),

    FirestoreModule.forRoot({
      useFactory: () => ({
        projectId: process.env.GCLOUD_PROJECT_ID,
        credentials: {
          client_email: process.env.GCLOUD_CLIENT_EMAIL,
          private_key: process.env.GCLOUD_PRIVATE_KEY,
        },
      }),
    }),

    CloudTasksModule.forRoot({
      projectId: process.env.GCLOUD_PROJECT_ID,
      projectRegion: process.env.GCLOUD_PROJECT_REGION,
      credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY,
      },
    }),

    EtaModule.forRoot({
      identityUrl: process.env.ETA_IDENTITY_URL,
      apiVersionUrl: process.env.ETA_API_VERSION_URL,
      apiTokenUrl: process.env.ETA_API_TOKEN_URL,
    }),

    // ? App Modules

    UserModule,
    OrganizationModule,
    AccountModule,
    ClientModule,
    CodeModule,
  ],

  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        disableErrorMessages: false,
        whitelist: false, // TODO: TURN IT ON AFTER SETTING UP ENTITIES DTO
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
