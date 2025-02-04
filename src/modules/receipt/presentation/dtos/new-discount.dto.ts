import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { NewDiscount } from '../../domain/entities/receipt.entity';

export class NewDiscountDto implements NewDiscount {
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
