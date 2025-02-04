import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PhoneDto } from '../../../../core/dtos/phone.dto';
import { IssuerType } from '../../../../core/providers';
import { ReceiptReceiver, ReceiverAddress } from '../../domain/entities/receipt.entity';

export class ReceiverAddressDto implements ReceiverAddress {
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
  city?: string;

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

export class ReceiptReceiverDto implements ReceiptReceiver {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    example: 'IQRA Network',
    description: 'Issuer organization name ',
  })
  name: string;

  @ApiProperty({
    name: 'taxId',
    type: String,
    required: true,
    example: '95846541564',
    description: 'Organization taxId ',
  })
  @IsNotEmpty()
  @IsString()
  taxId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReceiverAddressDto)
  @ApiProperty({
    name: 'address',
    type: () => ReceiverAddressDto,
    required: true,
    description: 'The receiver address.',
  })
  address: ReceiverAddressDto;

  @ApiProperty({
    name: 'type',
    enum: IssuerType,
    type: String,
    required: true,
    example: IssuerType.PERSON,
    description: 'Type of the issuer - supported values - B for business in Egypt, P for natural person, F for foreigner.',
  })
  @IsNotEmpty()
  @IsEnum(IssuerType)
  @IsString()
  type: IssuerType;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    name: 'email',
    type: String,
    required: false,
    example: 'ahmed.doe@example.com',
    description: 'The business email address.',
  })
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PhoneDto)
  @ApiProperty({
    name: 'phoneNumber',
    type: () => PhoneDto,
    required: false,
    description: 'The phone number of the organization.',
  })
  phone?: PhoneDto;
}
