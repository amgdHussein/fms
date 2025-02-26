import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { DiscountDto } from '../../../../core/dtos';
import { Discount } from '../../../../core/models';
import { ProductTax } from '../../../organization/domain';
import { ReceiptItem } from '../../domain/entities';

export class ReceiptItemDto implements ReceiptItem {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'id',
    type: String,
    required: true,
    example: 1681214766653,
    description: 'Unique item id.',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'organizationId',
    type: String,
    required: true,
    example: '1681214766653',
    description: 'Organization Id of the receipt',
  })
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'clientId',
    type: String,
    required: true,
    example: 'cl-12345',
    description: 'Unique identifier of the client making the payment',
  })
  clientId: string;

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({
  //   name: 'receiptId',
  //   type: String,
  //   required: true,
  //   example: 'sad54asd5ad5',
  //   description: 'Receipt Id',
  // })
  // receiptId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'productId',
    type: String,
    required: true,
    example: 'sad54asd5ad5',
    description: 'Product Id',
  })
  productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'codeId',
    type: String,
    required: true,
    example: 'sad54asd5ad5',
    description: 'Code Id',
  })
  codeId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    example: 'Simple plan lessons',
    description: 'Item name',
  })
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    name: 'nameAr',
    type: String,
    required: false,
    example: 'دروس خطة بسيطة',
    description: 'Item name in Arabic',
  })
  nameAr?: string;

  @IsOptional()
  @IsString()
  // @IsNotEmpty()
  @ApiProperty({
    name: 'description',
    type: String,
    required: false,
    example: 'Test Mohy with Tr. Farag Samir',
    description: 'Invoice line description',
  })
  description?: string;

  @IsOptional()
  @IsString()
  // @IsNotEmpty()
  @ApiProperty({
    name: 'description',
    type: String,
    required: false,
    example: 'Test Mohy with Tr. Farag Samir',
    description: 'Invoice line description',
  })
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  // @IsNotEmpty()
  @ApiProperty({
    name: 'category',
    type: String,
    required: false,
    example: 'IT',
    description: 'Item category',
  })
  category: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'unitPrice',
    type: Number,
    required: true,
    example: 10,
    description: 'Item unit price',
  })
  unitPrice: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'unitType',
    type: String,
    required: true,
    example: 'KG',
    description: 'Unit Type of code',
  })
  unitType: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'quantity',
    type: Number,
    required: true,
    example: 16,
    description: 'Item quantity',
  })
  quantity: number;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DiscountDto)
  @ApiProperty({
    name: 'discount',
    type: () => DiscountDto,
    required: false,
    // example: {
    //   type: 'percentage',
    //   amount: 20,
    // },
    description: 'Receipt discount',
  })
  discount?: DiscountDto;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'grossAmount',
    type: Number,
    required: true,
    example: 300,
    description: 'The total cost of product or service before taxes and discounts',
  })
  grossAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'netAmount',
    type: Number,
    required: true,
    example: 300,
    description: 'The total cost after discounts but before taxes',
  })
  netAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'totalAmount',
    type: Number,
    required: true,
    example: 300,
    description: 'The total amount of the receipt',
  })
  totalAmount: number; // The total cost after discounts and taxes

  @IsOptional()
  @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ItemTaxDto)
  taxes?: ProductTax[];

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DiscountDto)
  @ApiProperty({
    name: 'discount',
    type: () => DiscountDto,
    required: false,
    description: 'Receipt discount',
  })
  taxDiscount?: Discount;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'profitOrLoss',
    type: Number,
    required: false,
    example: 1,
    description: 'The profitOrLoss of the item',
  })
  profitOrLoss?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'createdBy',
    type: String,
    required: true,
    example: 'admin',
    description: 'User who created the payment record',
  })
  createdBy: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'createdAt',
    type: Number,
    required: true,
    example: 1678900000,
    description: 'Timestamp when the payment record was created',
  })
  createdAt: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'updatedBy',
    type: String,
    required: false,
    example: 'admin',
    description: 'User who last updated the payment record',
  })
  updatedBy: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    name: 'updatedAt',
    type: Number,
    required: false,
    example: 1678950000,
    description: 'Timestamp when the payment record was last updated',
  })
  updatedAt: number;
}
