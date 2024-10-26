export class QueryResult<T> {
  constructor(
    public readonly data: T[], // The search result data
    public readonly page: number, // The offset starting that searching starting at
    public readonly pages: number, // The number of pages that can be queried
    public readonly perPage: number, // The number of fetched items per page
    public readonly total: number, // Total number of items
  ) {}
}
