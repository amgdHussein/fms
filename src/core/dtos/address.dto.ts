import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Address } from '../models';

export class AddressDto implements Address {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'country',
    type: String,
    required: true,
    example: 'EG',
    description: 'Country code',
  })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'street',
    type: String,
    required: true,
    example: '123 Main Street',
    description: 'Street address',
  })
  street: string;

  @IsOptional()
  @IsString()
  // @IsNotEmpty()
  @ApiProperty({
    name: 'city',
    type: String,
    required: true,
    example: 'New York',
    description: 'The city (optional)',
  })
  city: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    name: 'governorate',
    type: String,
    required: false,
    example: 'Cairo',
    description: 'The state or province (optional)',
  })
  governorate?: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    name: 'postalCode',
    type: String,
    required: false,
    example: '10001',
    description: 'The postal code (optional)',
  })
  postalCode?: string;
}
