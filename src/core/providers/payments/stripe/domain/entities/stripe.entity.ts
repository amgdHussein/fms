export interface StripePayment {
  id: string;
  amount: number;
  currency: string;
  description: string;
  paymentIntentId: string;
  isPaid: boolean;
}
