export interface EncryptionConfigs {
  algorithm: string;
  secretKey: string;
  keyLength: number;
  digest: string;
  salt: string;
  iterations: number;
}
