import { Inject, Injectable, Logger } from '@nestjs/common';

import * as firebase from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { AUTH_APP_PROVIDER } from '../constants';
import { UnauthorizedException } from '../exceptions';

import { UserClaimsService } from './user-claims.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_APP_PROVIDER)
    private readonly app: firebase.app.App,
    private readonly userClaimsService: UserClaimsService,
  ) {}

  /**
   * Validate the user's token and return the decoded ID token.
   * @param {string} token - the user's token to be validated
   * @return {Promise<DecodedIdToken>} the decoded ID token
   */
  async validateUser(token: string): Promise<DecodedIdToken> {
    const claims = await this.app
      .auth()
      .verifyIdToken(token, true)
      .catch(error => {
        Logger.error(error);
        throw new UnauthorizedException('User is not authenticated!');
      });

    return claims; // TODO: FIX THIS BUG OF NOT SEND CONFIRM EMAIL and uncomment the below code
    // if (claims.email_verified) return claims;
    // throw new UnauthorizedException('Unverified user, please verify your email!');
  }
}
