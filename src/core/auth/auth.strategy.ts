import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';

import { AUTH_CONFIGS_PROVIDER, AUTH_PROVIDER, AUTH_STRATEGY } from '../constants';
import { AuthConfigs } from './auth.config';
import { AuthService } from './auth.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, AUTH_STRATEGY) {
  constructor(
    @Inject(AUTH_CONFIGS_PROVIDER)
    private readonly configs: AuthConfigs,

    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configs.privateKey,
    });
  }

  /**
   * Validates the token and returns the decoded user token information.
   *
   * @param {string} token - The token to be validated
   * @return {Promise<DecodedIdToken | null>} The decoded user token information, or null if the user is invalid
   */
  async validate(token: string): Promise<DecodedIdToken | null> {
    const user: DecodedIdToken = await this.authService.validateUser(token);

    if (!user) {
      return null; // Invalid user
    }

    return user; // Return user claims
  }
}
