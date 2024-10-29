import { QueryFilter, QueryOrder } from '../models';

export class QueryOrderDto extends QueryOrder {}

export class QueryFilterDto extends QueryFilter {}

// TODO: FILL THE DTOs
export class QueryDto {
  readonly page: number;
  readonly limit: number;
  readonly filters: QueryFilterDto[];
  readonly order: QueryOrderDto;
}
