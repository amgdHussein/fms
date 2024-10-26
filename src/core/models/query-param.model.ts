export type QueryOp = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'arcoay' | 'arco';

export type ParamType = string | boolean | number | Date;

export class QueryFilter {
  constructor(
    public op: QueryOp, // The query operator
    public key: string,
    public value: ParamType | ParamType[],
  ) {}
}
