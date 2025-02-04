import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ItemTax } from '../../domain/entities/receipt.entity';

export class ItemTaxDto implements ItemTax {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'taxType',
    type: String,
    required: true,
    example: 'T2',
    description: 'Tax type listed in the tax authority',
  })
  taxType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'subType',
    type: String,
    required: true,
    example: 'V002',
    description: 'Tax sub type listed in the tax authority',
  })
  subType?: string;

  @ApiProperty({
    name: 'type',
    type: Number,
    required: true,
    example: 'fixed',
    enum: ['fixed', 'percentage'],
    description: 'Discount type either fixed or percentage',
  })
  // @IsOptional()
  @IsNotEmpty()
  @IsString()
  type: 'fixed' | 'percentage';

  @ApiProperty({
    name: 'value',
    type: Number,
    required: true,
    example: 50,
    description: 'The value of discount either fixed or percentage',
  })
  // @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
