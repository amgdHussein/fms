import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { Payment, PaymentType } from '../../domain/entities';

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
    name: 'systemId',
    type: String,
    required: true,
    example: '1681214766653',
    description: 'System id',
  })
  systemId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'invoiceNumber',
    type: String,
    required: true,
    example: '16812',
    description: 'Invoice number',
  })
  invoiceNumber: string;

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
  @IsString()
  @ApiProperty({
    name: 'invoiceId',
    type: String,
    required: true,
    example: 'inv-67890',
    description: 'Unique identifier of the invoice related to the payment',
  })
  invoiceId: string;

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
  @IsEnum(PaymentType)
  @ApiProperty({
    name: 'type',
    enum: PaymentType,
    required: true,
    example: PaymentType.CASH,
    description: 'The method of payment',
  })
  type: PaymentType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'currency',
    type: String,
    required: true,
    example: 'USD',
    description: 'The currency in which the payment is made',
  })
  currency: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'notes',
    type: String,
    required: false,
    example: 'The client paid in cash',
    description: 'Additional notes related to the payment',
  })
  comment?: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    name: 'isProductionMode',
    type: Boolean,
    required: true,
    example: true,
    description: 'The database mode',
  })
  isProductionMode: boolean;

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
