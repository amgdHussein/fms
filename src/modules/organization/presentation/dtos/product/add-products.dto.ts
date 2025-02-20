import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { AddOrganizationProductDto } from './add-product.dto';

export class AddOrganizationProductsDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Array<AddOrganizationProductDto>)
  @ApiProperty({
    name: 'products',
    type: Array<AddOrganizationProductDto>,
    required: true,
    description: 'Array of products to set.',
  })
  products: AddOrganizationProductDto[]; //TODO: REVISE THIS
}
