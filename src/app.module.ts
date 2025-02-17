import { BullModule } from '@nestjs/bull';
import { Module, Scope, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import * as Joi from 'joi';

import { AuthModule } from './core/auth';
import { ExceptionFilter } from './core/filters';
import { LoggingInterceptor } from './core/interceptors';
import {
  CloudTasksModule,
  EasyKashModule,
  EtaModule,
  EventEmitterModule,
  FireAuthModule,
  FirestoreModule,
  GmailModule,
  HttpModule,
  PaypalModule,
  PayTabsModule,
  RedisModule,
  StripeModule,
} from './core/providers';

import { ClsModule } from 'nestjs-cls';
import { Environment } from './core/constants';
import { AccountModule, ClientModule, CodeModule, InvoiceModule, LoggingModule, OrganizationModule, UserModule } from './modules';
import { PaymentModule } from './modules/payment/payment.module';
import { ReceiptModule } from './modules/receipt';

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

    ClsModule.forRoot({
      global: true,
      interceptor: {
        mount: true, // Automatically mount the ClsMiddleware for all routes
        setup: (cls, req) => {
          // Setup/store context data for the current request
          const ctx = req.switchToHttp().getRequest();
          const user = !ctx.user && process.env.NODE_ENV != Environment.PROD ? { uid: 'test' } : ctx.user;
          cls.set('currentUser', user); // Store the current authenticated user
        },
      },
    }),

    // ? Core Modules

    AuthModule,

    FireAuthModule.forRoot({
      dbURL: process.env.FIREBASE_DATABASE_URL,
      serviceAccount: {
        projectId: process.env.GCLOUD_PROJECT_ID,
        clientEmail: process.env.GCLOUD_CLIENT_EMAIL,
        privateKey: process.env.GCLOUD_PRIVATE_KEY,
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

    GmailModule.forRoot({
      email: process.env.GMAIL_EMAIL,
      clientId: process.env.GMAIL_CLIENT_ID,
      privateKey: process.env.GMAIL_PRIVATE_KEY,
    }),

    EtaModule.forRoot({
      identityUrl: process.env.ETA_IDENTITY_URL,
      apiVersionUrl: process.env.ETA_API_VERSION_URL,
      apiTokenUrl: process.env.ETA_API_TOKEN_URL,
    }),

    StripeModule.forRoot({
      apiKey: process.env.STRIPE_API_KEY,
    }),

    PayTabsModule.forRoot({
      serverKey: '',
    }),

    PaypalModule.forRoot({
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      port: +process.env.PAYPAL_PORT,
    }),

    EasyKashModule.forRoot({
      secretKey: process.env.EASY_KASH_SECRET_KEY,
    }),

    // ? App Modules

    LoggingModule,
    UserModule,
    AccountModule,
    ClientModule,
    OrganizationModule,
    CodeModule,
    InvoiceModule,
    PaymentModule,
    ReceiptModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
      scope: Scope.REQUEST,
    },

    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        disableErrorMessages: process.env.NODE_ENV == Environment.PROD,
        whitelist: process.env.NODE_ENV != Environment.DEV,
        transform: true,
      }),
    },

    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
