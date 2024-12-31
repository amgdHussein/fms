import { Global, Module, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AUTH_PROVIDER } from '../constants';

import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

const authServiceProvider: Provider = {
  provide: AUTH_PROVIDER,
  useClass: AuthService,
};

@Global()
@Module({
  imports: [PassportModule],
  providers: [authServiceProvider, AuthStrategy],
  exports: [authServiceProvider],
})
export class AuthModule {}
