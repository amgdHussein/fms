import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { UpdateOrganizationProductDto } from './update-product.dto';

export class UpdateOrganizationProductsDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Array<UpdateOrganizationProductDto>)
  @ApiProperty({
    name: 'products',
    type: Array<UpdateOrganizationProductDto>,
    required: true,
    description: 'Array of products to update.',
  })
  products: UpdateOrganizationProductDto[]; //TODO: REVISE THIS
}
