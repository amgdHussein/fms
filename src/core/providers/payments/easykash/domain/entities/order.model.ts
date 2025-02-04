export class Order {
  constructor(
    public orderId: string,
    public billingFirstName: string,
    public billingLastName: string,
    public billingEmail: string,
    public billingPhone: string,
    public total: number,
  ) {}

  getCheckoutOrderReceivedUrl(): string {
    return `https://example.com/checkout/order-received/${this.orderId}/`;
  }

  updateStatus(status: string, _: any, __: boolean): void {
    console.log(`Order ${this.orderId} status updated to ${status}`);
  }

  hasStatus(status: string): boolean {
    // Mocking function, replace it with your logic
    return true;
  }

  getBillingFirstName(): string {
    return this.billingFirstName;
  }

  getBillingLastName(): string {
    return this.billingLastName;
  }

  getBillingEmail(): string {
    return this.billingEmail;
  }

  getBillingPhone(): string {
    return this.billingPhone;
  }
}
