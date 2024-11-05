export interface ItemTax {
  taxType: string;
  subType?: string;
  type: 'fixed' | 'percentage';
  value: number;
}
