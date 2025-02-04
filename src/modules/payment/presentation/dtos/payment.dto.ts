import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { CurrencyDto } from '../../../../core/dtos/currency.dto';
import { Payment, PaymentMethod, PaymentType } from '../../domain/entities';
import { PaymentCategory, PaymentStatus } from '../../domain/entities/payment.entity';

export class PaymentDto implements Payment {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'id',
    type: String,
    required: true,
    example: '1234567890',
    description: 'Unique identifier for the payment record',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'organizationId',
    type: String,
    required: true,
    example: 'a5s4d15as414s5dd',
    description: 'organizationId',
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'clientName',
    type: String,
    required: true,
    example: 'Ahmed Ali',
    description: 'The client name of the payment',
  })
  clientName: string;

  @IsNotEmpty()
  @IsEnum(PaymentCategory)
  @ApiProperty({
    name: 'category',
    enum: PaymentCategory,
    required: true,
    example: PaymentCategory.INVOICE,
    description: 'The category of payment',
  })
  category: PaymentCategory;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'entityId',
    type: String,
    required: true,
    example: 'inv-67890',
    description: 'Unique identifier of the kind of category related to the payment',
  })
  entityId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'entityNumber',
    type: String,
    required: true,
    example: '16812',
    description: 'Entity number',
  })
  entityNumber: string;

  @IsNotEmpty()
  @IsEnum(PaymentType)
  @ApiProperty({
    name: 'type',
    enum: PaymentType,
    required: true,
    example: PaymentType.INCOME,
    description: 'The type of payment',
  })
  type: PaymentType;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  @ApiProperty({
    name: 'status',
    enum: PaymentStatus,
    required: true,
    example: PaymentStatus.COMPLETED,
    description: 'The status of payment',
  })
  status: PaymentStatus;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'amount',
    type: Number,
    required: true,
    example: 50,
    description: 'The amount of payment',
  })
  amount: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CurrencyDto)
  @ApiProperty({
    name: 'currency',
    type: () => CurrencyDto,
    required: true,
    description: 'Currency details',
  })
  currency: CurrencyDto;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'transactionId',
    type: String,
    required: false,
    example: 'asd41854d5as4d54',
    description: 'TransactionId ID in our system',
  })
  transactionId: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({
    name: 'method',
    enum: PaymentMethod,
    required: true,
    example: PaymentMethod.CASH,
    description: 'The method of payment',
  })
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'referenceId',
    type: String,
    required: false,
    example: 'cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u',
    description: 'Reference ID from the payment gateway',
  })
  referenceId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'processedAt',
    type: Number,
    required: true,
    example: 3500,
    description: 'The timestamp of when the payment was being processed',
  })
  processedAt: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'paidAt',
    type: Number,
    required: true,
    example: 3500,
    description: 'The timestamp of when the payment was made',
  })
  paidAt: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'notes',
    type: String,
    required: false,
    example: 'The client paid in cash',
    description: 'Additional notes related to the payment',
  })
  notes?: string;

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
  createdBy?: string;

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
  createdAt?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'updatedBy',
    type: String,
    required: false,
    example: 'admin',
    description: 'User who last updated the payment record',
  })
  updatedBy?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    name: 'updatedAt',
    type: Number,
    required: false,
    example: 1678950000,
    description: 'Timestamp when the payment record was last updated',
  })
  updatedAt?: number;
}
