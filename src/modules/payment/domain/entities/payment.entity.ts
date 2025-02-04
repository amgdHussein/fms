export interface Payment {
  id: string;
  clientId: string;
  systemId: string;
  clientName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  type: PaymentType;
  currency: string;
  paidAt: number;
  comment?: string;
  isProductionMode: boolean;

  createdBy?: string;
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
}

export enum PaymentType {
  CHECK = 0,
  CREDIT = 1,
  CASH = 2,
}

export enum PaymentStatus {
  PENDING = 0,
  COMPLETED = 1,
  FAILED = 2,
  PARTIALLY_PAID = 3,
  REFUNDED = 4,
}
