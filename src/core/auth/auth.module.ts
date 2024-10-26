import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import * as firebase from 'firebase-admin';

import { AUTH_APP_PROVIDER, AUTH_CONFIGS_PROVIDER, AUTH_PROVIDER } from '../constants';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';
import { UserClaimsService } from './user-claims.service';

@Module({})
export class AuthModule {
  static forRoot(serviceAccount: firebase.ServiceAccount): DynamicModule {
    const serviceAccountProvider: Provider = {
      provide: AUTH_CONFIGS_PROVIDER,
      useFactory: () => serviceAccount,
    };

    const fireAuthAppProvider: Provider = {
      provide: AUTH_APP_PROVIDER,
      useFactory: (serviceAccount: firebase.ServiceAccount): firebase.app.App => {
        const app = firebase.initializeApp({
          credential: firebase.credential.cert(serviceAccount),
        });

        return app;
      },
      inject: [AUTH_CONFIGS_PROVIDER],
    };

    const authServiceProvider: Provider = {
      provide: AUTH_PROVIDER,
      useClass: AuthService,
    };

    const targetModule: DynamicModule = {
      global: true,
      imports: [PassportModule],
      providers: [serviceAccountProvider, fireAuthAppProvider, authServiceProvider, UserClaimsService, AuthStrategy],
      exports: [authServiceProvider],
      module: AuthModule,
    };

    return targetModule;
  }
}
