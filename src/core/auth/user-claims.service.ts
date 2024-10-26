import { Inject } from '@nestjs/common';

import * as firebase from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { AUTH_APP_PROVIDER } from '../constants';
import { UnauthorizedException } from '../exceptions';

export class UserClaimsService {
  constructor(
    @Inject(AUTH_APP_PROVIDER)
    private readonly app: firebase.app.App,
  ) {}

  /**
   * Retrieves the user claims for the specified user ID.
   *
   * @param {string} userId - The ID of the user for whom to retrieve the claims.
   * @return {Promise<DecodedIdToken>} A promise that resolves with the decoded ID token representing the user's claims.
   */
  async userClaims(userId: string): Promise<DecodedIdToken> {
    const claims = (await this.app.auth().getUser(userId)).customClaims as DecodedIdToken;

    if (!claims) return {} as DecodedIdToken;
    if (claims && claims.email_verified) return claims;

    throw new UnauthorizedException('Unverified user!');
  }

  /**
   * Set user claims for the given user ID.
   *
   * @param {string} userId - The ID of the user
   * @param {object} claims - The custom claims to be set for the user
   * @return {Promise<void>} A Promise that resolves when the custom claims are set
   */
  async setUserClaims(userId: string, claims: object): Promise<void> {
    await firebase.auth().setCustomUserClaims(userId, claims);
  }
}
