// BACKEND (using Node.js crypto)
// encryption.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as util from 'util';

@Injectable()
export class EncryptionService {
  private readonly pbkdf2 = util.promisify(crypto.pbkdf2);
  private readonly algorithm = 'aes-256-cbc';
  private readonly iterations = 100000;
  private readonly keyLength = 32; // 256 bits
  private readonly digest = 'sha256';
  private readonly salt = 'fixed-salt'; // In production, use a secure salt

  private readonly keyString = process.env.ENCRYPTION_SECRET;

  private async deriveKey(): Promise<Buffer> {
    return this.pbkdf2(this.keyString, this.salt, this.iterations, this.keyLength, this.digest);
  }

  /**
   * Decrypts an encrypted string
   * @param encryptedData String in "iv:encryptedData" format
   * @returns Promise resolving to the decrypted object
   */
  async decrypt(encryptedData: string): Promise<any> {
    try {
      // Split the IV and encrypted data
      const [ivBase64, encryptedBase64] = encryptedData.split(':');

      if (!ivBase64 || !encryptedBase64) {
        throw new Error('Invalid encrypted data format');
      }

      // Convert from base64
      const iv = Buffer.from(ivBase64, 'base64');
      const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');

      // Derive the key using the provided keyString
      const key = await this.deriveKey();

      // Create the decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);

      // Decrypt the data
      const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

      return JSON.parse(decrypted.toString('utf8'));
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encrypts an object
   * @param data Any serializable object to encrypt
   * @returns Promise resolving to "iv:encryptedData" string format
   */
  async encrypt(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);

      // Generate a random IV
      const iv = crypto.randomBytes(16);

      // Derive the key using the provided keyString
      const key = await this.deriveKey();

      // Create the cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      // Encrypt the data
      const encrypted = Buffer.concat([cipher.update(Buffer.from(jsonString, 'utf8')), cipher.final()]);

      // Return the IV and encrypted data, both as base64
      const ivBase64 = iv.toString('base64');
      const encryptedBase64 = encrypted.toString('base64');

      return `${ivBase64}:${encryptedBase64}`;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }
}
