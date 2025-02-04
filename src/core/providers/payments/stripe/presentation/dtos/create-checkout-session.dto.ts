// import { IsArray, ArrayMinSize, IsNumber, IsPositive, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';

// class ItemDto {
//   @IsNumber()
//   @IsPositive()
//   id: number;

//   @IsNumber()
//   @IsPositive()
//   quantity: number;
// }

// export class CreateCheckoutSessionDto {
//   @IsArray()
//   @ArrayMinSize(1)
//   @ValidateNested({ each: true })
//   @Type(() => ItemDto)
//   items: ItemDto[];
// }
