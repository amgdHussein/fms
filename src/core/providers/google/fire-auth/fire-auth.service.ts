import { Inject, Injectable, Logger } from '@nestjs/common';

import * as admin from 'firebase-admin';
import { ListUsersResult } from 'firebase-admin/lib/auth/base-auth';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { isEqual } from 'lodash';

import { FIRE_AUTH_CONFIGS_PROVIDER } from '../../../constants';
import { UnauthorizedException } from '../../../exceptions';

import { FireAuthConfigs } from './fire-auth.config';

@Injectable()
export class FireAuthService {
  private readonly logger = new Logger(FireAuthService.name);

  private readonly app: admin.app.App;

  constructor(
    @Inject(FIRE_AUTH_CONFIGS_PROVIDER)
    configs: FireAuthConfigs,
  ) {
    try {
      this.app = admin.initializeApp({
        credential: admin.credential.cert(configs.serviceAccount),
        databaseURL: configs.dbURL,
      });
    } catch (error) {
      this.logger.error('Firebase/ Admin Initialization Error: ', error.message);
    }
  }

  /**
   * Retrieves a user's details from the Firebase Authentication service.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserRecord>} - A promise that resolves with the user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async getUser(id: string): Promise<UserRecord> {
    return this.app.auth().getUser(id);
  }

  /**
   * Retrieves a user's details from the Firebase Authentication service by their email address.
   *
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<UserRecord>} - A promise that resolves with the user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async getUserByEmail(email: string): Promise<UserRecord> {
    return this.app.auth().getUserByEmail(email);
  }

  /**
   * Retrieves a paginated list of users from the Firebase Authentication service.
   *
   * @param {string} [pageToken] - Optional token for fetching the next page of users.
   * @param {number} [limit=1000] - The maximum number of users to retrieve.
   * @returns {Promise<ListUsersResult>} - A promise that resolves with the list of users and a token for the next page.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async getUsers(pageToken?: string, limit: number = 1000): Promise<ListUsersResult> {
    return this.app.auth().listUsers(limit, pageToken);
  }

  /**
   * Creates a new user in the Firebase Authentication service.
   *
   * @param {string} email - The email address of the new user.
   * @param {string} password - The password to assign to the new user.
   * @param {string} name - The name of the new user.
   * @param {string} [phone] - The phone number of the new user (optional).
   * @returns {Promise<UserRecord>} - A promise that resolves with the newly created user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async registerUser(email: string, password: string, name: string, phone?: string): Promise<UserRecord> {
    return this.app.auth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone,
    });
  }

  /**
   * Updates the specified user's data in the Firebase Authentication service.
   *
   * @param {Partial<UserRecord> & { uuid: string }} user - The user data to be updated.
   * The uuid field is required and specifies the user to be updated.
   * The email, displayName, phoneNumber, and photoURL fields will be updated if they are specified.
   * @returns {Promise<UserRecord>} - A promise that resolves with the updated user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async updateUser(user: Partial<UserRecord> & { uuid: string }): Promise<UserRecord> {
    const { uuid, ...updateData } = user;

    return this.app.auth().updateUser(uuid, {
      email: updateData.email,
      displayName: updateData.displayName,
      phoneNumber: updateData.phoneNumber,
      photoURL: updateData.photoURL,
    });
  }

  /**
   * Deletes a user from the Firebase Authentication service.
   *
   * @param {string} id - The ID of the user to be deleted.
   * @returns {Promise<void>} - A promise that resolves once the user has been deleted.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async deleteUser(id: string): Promise<void> {
    return this.app.auth().deleteUser(id);
  }

  /**
   * Generates an email verification link for the specified email address.
   *
   * @param {string} email - The email address for which to generate the verification link.
   * @returns {Promise<string>} - A promise that resolves with the verification link.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async generateEmailVerificationLink(email: string): Promise<string> {
    // Generate the email verification link
    return this.app.auth().generateEmailVerificationLink(email);
  }

  /**
   * Marks the user as verified in the Firebase Authentication service.
   *
   * @param {string} id - The ID of the user to be verified.
   * @returns {Promise<UserRecord>} - A promise that resolves with the updated user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async verifyUser(id: string): Promise<UserRecord> {
    return this.app.auth().updateUser(id, {
      emailVerified: true,
    });
  }

  /**
   * Generates a password reset link for the specified email address.
   *
   * @param {string} email - The email address for which to generate the password reset link.
   * @returns {Promise<string>} - A promise that resolves with the password reset link.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async generatePasswordResetLink(email: string): Promise<string> {
    // Generate the password reset link
    return this.app.auth().generatePasswordResetLink(email);
  }

  /**
   * Enables the user with the specified ID in the Firebase Authentication service.
   *
   * @param {string} id - The ID of the user to be enabled.
   * @returns {Promise<UserRecord>} - A promise that resolves with the updated user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async activateUser(id: string): Promise<UserRecord> {
    return this.app.auth().updateUser(id, {
      disabled: false,
    });
  }

  /**
   * Disables a user in the Firebase Authentication service.
   *
   * @param {string} id - The ID of the user to be deactivated.
   * @returns {Promise<UserRecord>} - A promise that resolves with the updated user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async deactivateUser(id: string): Promise<UserRecord> {
    return this.app.auth().updateUser(id, {
      disabled: true,
    });
  }

  /**
   * Validate the user's token and return the decoded ID token.
   * @param {string} token - the user's token to be validated
   * @return {Promise<DecodedIdToken>} the decoded ID token
   */
  async validateUserToken(token: string): Promise<DecodedIdToken> {
    const claims = await this.app
      .auth()
      .verifyIdToken(token, true)
      .catch(error => {
        this.logger.error(`Error verifying token: ${error.message}!`);
        throw new UnauthorizedException('Invalid token!');
      });

    if (claims.email_verified) return claims;
    throw new UnauthorizedException('Unverified user, please verify your email!');
  }

  /**
   * Retrieves the user claims for the specified user ID.
   *
   * @param {string} id - The ID of the user for whom to retrieve the claims.
   * @return {Promise<DecodedIdToken>} A promise that resolves with the decoded ID token representing the user's claims.
   */
  async getUserClaims(id: string): Promise<DecodedIdToken> {
    const claims = (await this.app.auth().getUser(id)).customClaims as DecodedIdToken;

    if (!claims) return {} as DecodedIdToken;
    if (claims && claims.email_verified) return claims;

    throw new UnauthorizedException('Unverified user!');
  }

  /**
   * Set user claims for the given user ID.
   *
   * @param {string} id - The ID of the user
   * @param {object} customUserClaims - The custom claims to be set for the user
   * @return {Promise<void>} A Promise that resolves when the custom claims are set
   */
  async setUserClaims(id: string, customUserClaims: object): Promise<void> {
    await this.app.auth().setCustomUserClaims(id, customUserClaims);
  }

  /**
   * Updates the custom claims for the specified user ID.
   * If the user does not have existing claims, it sets the provided claims as new claims.
   * If the user has existing claims, it updates only the changed claims.
   *
   * @param {string} id - The ID of the user whose claims are to be updated.
   * @param {object} claims - The custom claims to update for the user.
   * @returns {Promise<void>} A promise that resolves when the claims have been updated.
   */
  async updateUserClaims(id: string, claims: object): Promise<void> {
    const userClaims = (await this.app.auth().getUser(id)).customClaims;

    if (!userClaims) {
      await this.setUserClaims(id, claims);
    }

    if (!isEqual(claims, userClaims)) {
      if (userClaims) {
        const claimsKeys = Object.keys(claims);

        // Loop through the claims and update the userClaims object
        for (const claimKey of claimsKeys) {
          userClaims[claimKey] = claims[claimKey];
        }

        await this.app.auth().setCustomUserClaims(id, userClaims);
      }
    }
  }
}
