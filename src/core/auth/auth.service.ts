import { Inject, Injectable } from '@nestjs/common';

import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { ClsService } from 'nestjs-cls';

import { Phone } from '../common';
import { FIRE_AUTH_PROVIDER, GMAIL_PROVIDER, SUPPORT_EMAIL } from '../constants';
import { FireAuthService, GmailService, SenderType } from '../providers';

@Injectable()
export class AuthService {
  constructor(
    @Inject(FIRE_AUTH_PROVIDER)
    private readonly authService: FireAuthService,

    @Inject(GMAIL_PROVIDER)
    private readonly gmailService: GmailService,

    private readonly clsService: ClsService,
  ) {}

  /**
   * Retrieves the currently logged-in user from the CLS context.
   *
   * @returns {Promise<UserRecord>} - A promise that resolves with the currently logged-in user.
   */
  public get currentUser(): UserRecord {
    return this.clsService.get<UserRecord>('currentUser');
  }

  /**
   * Retrieves a user from Firebase Authentication by their ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserRecord>} - A promise that resolves with the user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async getUser(id: string): Promise<UserRecord> {
    return this.authService.getUser(id);
  }

  /**
   * Retrieves a user's details from Firebase Authentication by their email address.
   *
   * @param {string} email - The email address of the user to retrieve.
   * @returns {Promise<UserRecord>} - A promise that resolves with the user's details.
   * @throws {FirebaseError} - If the request to Firebase Authentication fails.
   */
  async getUserByEmail(email: string): Promise<UserRecord> {
    return this.authService.getUserByEmail(email);
  }

  /**
   * Registers a new user with Firebase Authentication.
   *
   * @param {string} email - The email address of the new user.
   * @param {string} password - The password to assign to the new user.
   * @param {string} name - The name of the new user.
   * @param {Phone} [phone] - The phone number of the new user, including country code (optional).
   * @returns {Promise<UserRecord>} - A promise that resolves with the newly created user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async registerUser(email: string, password: string, name: string, phone?: Phone): Promise<UserRecord> {
    if (phone) {
      const phoneNumber = phone.code + phone.value;
      return this.authService.registerUser(email, password, name, phoneNumber);
    }

    return this.authService.registerUser(email, password, name);
  }

  /**
   * Validates the provided token and returns the decoded user token information.
   *
   * @param {string} token - The token to be validated.
   * @returns {Promise<DecodedIdToken>} - A promise that resolves with the decoded ID token.
   */
  async validateUser(token: string): Promise<DecodedIdToken> {
    return this.authService.validateUserToken(token);
  }

  /**
   * Marks the user as verified in the Firebase Authentication service.
   *
   * @param {string} id - The ID of the user to be verified.
   * @returns {Promise<UserRecord>} - A promise that resolves with the updated user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async verifyUser(id: string): Promise<UserRecord> {
    return this.authService.verifyUser(id);
  }

  /**
   * Enables the user with the specified ID in the Firebase Authentication service.
   *
   * @param {string} id - The ID of the user to be enabled.
   * @returns {Promise<UserRecord>} - A promise that resolves with the updated user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async activateUser(id: string): Promise<UserRecord> {
    return this.authService.activateUser(id);
  }

  /**
   * Disables the user with the specified ID in the Firebase Authentication service.
   *
   * @param {string} id - The ID of the user to be deactivated.
   * @returns {Promise<UserRecord>} - A promise that resolves with the updated user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async deactivateUser(id: string): Promise<UserRecord> {
    return this.authService.deactivateUser(id);
  }

  /**
   * Updates the specified user's data in the Firebase Authentication service.
   *
   * @param {Partial<UserRecord> & { id: string }} user - The user data to be updated.
   * The uuid field is required and specifies the user to be updated.
   * The email, displayName, phoneNumber, and photoURL fields will be updated if they are specified.
   * @returns {Promise<UserRecord>} - A promise that resolves with the updated user's details.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async updateUser(user: Partial<UserRecord> & { id: string }): Promise<UserRecord> {
    const { id, ...updateData } = user;

    return this.authService.updateUser({
      uuid: id,
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
    return this.authService.deleteUser(id);
  }

  /**
   * Sends an email verification link to the specified user's email address.
   *
   * @param {string} id - The ID of the user to send the verification email to.
   * @returns {Promise<string>} - A promise that resolves with the verification link.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async sendEmailVerification(id: string): Promise<string> {
    // Get the user by ID
    const user = await this.authService.getUser(id);

    // Generate the email verification link
    const link = await this.authService.generateEmailVerificationLink(id);

    // Send the email
    await this.gmailService.addJob({
      senderType: SenderType.SUPPORT,
      senderName: 'FCM Support',
      recipient: user.email,
      subject: 'Verify your email address',
      body: `Please verify your email by clicking on the following link: ${link}`,
      replyTo: SUPPORT_EMAIL,
    });

    return link;
  }

  /**
   * Resets the password for a user and sends a password reset email to the user.
   *
   * @param {string} id - The ID of the user to reset the password for.
   * @returns {Promise<string>} - A promise that resolves with the password reset link.
   * @throws {FirebaseError} - If the request to the Firebase Authentication service fails.
   */
  async resetPassword(id: string): Promise<string> {
    // Get the user by ID
    const user = await this.authService.getUser(id);

    // Generate the password reset link
    const link = await this.authService.generatePasswordResetLink(user.email);

    // Send mail
    await this.gmailService.addJob({
      senderType: SenderType.SUPPORT,
      senderName: 'FCM Support',
      recipient: user.email,
      subject: 'Password Reset Request',
      body: `You requested a password reset. Please use the following link to reset your password: ${link}`,
      replyTo: SUPPORT_EMAIL,
    });

    return link;
  }
}
