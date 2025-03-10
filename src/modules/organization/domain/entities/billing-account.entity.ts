import { PaymentGateway } from '../../../../core/enums';

export interface BillingAccount {
  id: string;
  organizationId: string;
  gateway: PaymentGateway;
  credentials: string; // Encrypted credentials

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}

export namespace BillingAccount {
  //TODO: REMOVE THIS OR FIX
  export function fromCredentials(credentials: object): string {
    // TODO: Encrypt the credentials
    return '';
  }

  export function toCredentials(key: string): Record<string, string> {
    // TODO: Decrypt the key
    return {};
  }
}
