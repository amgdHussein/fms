import { QueryFilter, QueryOrder } from '../models';

export class QueryOrderDto extends QueryOrder {}

export class QueryFilterDto extends QueryFilter {}

// TODO: Fill the DTOs
export class QueryDto {
  readonly page: number;
  readonly limit: number;
  readonly filters: QueryFilterDto[];
  readonly order: QueryOrderDto;
}
