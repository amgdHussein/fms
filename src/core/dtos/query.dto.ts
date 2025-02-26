import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ParamType, QueryFilter, QueryOp, QueryOrder, SortDirection } from '../queries';

export class QueryOrderDto implements QueryOrder {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'key',
    type: String,
    required: true,
    example: 'createdAt',
    description: 'The key field to sort by',
  })
  readonly key: string;

  @IsIn(['asc', 'desc'])
  @ApiProperty({
    name: 'dir',
    type: String,
    required: true,
    example: 'asc',
    description: 'To sort data in ascending or descending manner',
  })
  readonly dir: SortDirection;
}

export class QueryFilterDto implements QueryFilter {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'key',
    type: String,
    required: true,
    example: 'email',
    description: 'The key field to query by',
  })
  readonly key: string;

  @IsIn(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'arco', 'arcoay'])
  @ApiProperty({
    name: 'operator',
    type: String,
    required: true,
    example: 'eq',
    description: 'Query operator',
  })
  readonly operator: QueryOp;

  @IsNotEmpty()
  @ApiProperty({
    name: 'value',
    type: Object,
    required: true,
    example: 'amgad.hussein@example.com',
    description: 'The key value in database only (string, number, boolean, Date) are allowed',
  })
  readonly value: ParamType | ParamType[];
}

export class QueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @ApiProperty({
    name: 'page',
    type: Number,
    required: false,
    example: 2,
    description: 'The page number to fetch data from (starting offset)',
  })
  readonly page: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @ApiProperty({
    name: 'limit',
    type: Number,
    required: false,
    example: 100,
    description: 'The number of required entities',
  })
  readonly limit: number;

  @IsOptional()
  // @Transform(({ value }) => Utils.QueryBuilder.decode(value).map(param => plainToClass(QueryFilterDto, param)))
  @Type(() => QueryFilterDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    name: 'filters',
    type: QueryFilterDto,
    required: false,
    example: [
      {
        key: 'moilePhone.iso',
        operator: 'eq',
        value: 'EG',
      },
    ],
    description: 'The sorting operation applied for current request',
  })
  readonly filters: QueryFilterDto[];

  @IsOptional()
  // @Transform(({ value }) => {
  //   const [key, dir] = value.split(':');
  //   return plainToClass(QueryOrderDto, { key, dir });
  // })
  @Type(() => QueryOrderDto)
  @ValidateNested()
  @ApiProperty({
    name: 'order',
    type: String,
    required: false,
    example: 'createdAt:desc',
    description: 'The sorting operation applied for current request',
  })
  readonly order: QueryOrderDto;
}
