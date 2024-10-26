export type SortDirection = 'asc' | 'desc';

export class QueryOrder {
  constructor(
    public key: string,
    public dir: SortDirection,
  ) {}
}
