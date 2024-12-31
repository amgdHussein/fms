import { ServiceAccount } from 'firebase-admin';

export interface FireAuthConfigs {
  serviceAccount: ServiceAccount;
  dbURL: string;
}
