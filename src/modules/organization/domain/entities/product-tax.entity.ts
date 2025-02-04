export interface ProductTax {
  taxType: string;
  subType?: string;
  type: 'fixed' | 'percentage';
  value: number;
}
