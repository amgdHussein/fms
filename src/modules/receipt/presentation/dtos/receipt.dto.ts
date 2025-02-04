import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { Receipt } from '../../domain/entities';
import { Authority, ReceiptCurrency, ReceiptDirection, ReceiptStatus, ReceiptType, TaxInvoiceStatus } from '../../domain/entities/receipt.entity';
import { ReceiptItemDto } from './receipt-Item.dto';
import { ReceiptIssuerDto } from './receipt-issuer.dto';
import { ReceiptReceiverDto } from './receipt-receiver.dto';

export class ReceiptCurrencyDto implements ReceiptCurrency {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'code',
    type: String,
    required: true,
    example: 'USD',
    description: 'Currency code used from ISO 4217.',
  })
  code: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'rate',
    type: Number,
    required: true,
    example: '50',
    description: 'Exchange rate of the Egyptian bank on the day of invoicing used to convert currency sold to the value of organization primary currency',
  })
  rate: number;
}

export class ReceiptDto implements Receipt {
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
    name: 'branchId',
    type: String,
    required: true,
    example: 'a48sd4as854d',
    description: 'Branch ID of the receipt',
  })
  branchId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReceiptIssuerDto)
  @ApiProperty({
    name: 'issuer',
    type: () => ReceiptIssuerDto,
    required: true,
    description: 'The receipt issuer details',
  })
  issuer: ReceiptIssuerDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReceiptReceiverDto)
  @ApiProperty({
    name: 'receiver',
    type: () => ReceiptReceiverDto,
    required: true,
    description: 'The receipt receiver details',
  })
  receiver: ReceiptReceiverDto;

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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'receiptNumber',
    type: String,
    required: true,
    example: '16812',
    description: 'Receipt Number',
  })
  receiptNumber: string;

  @IsNotEmpty()
  @IsEnum(ReceiptType)
  @ApiProperty({
    name: 'type',
    enum: ReceiptType,
    required: true,
    example: ReceiptType.SALE,
    description: 'The method of payment',
  })
  type: ReceiptType;

  @IsNotEmpty()
  @IsEnum(ReceiptDirection)
  @ApiProperty({
    name: 'direction',
    type: String,
    required: true,
    example: ReceiptDirection.SUBMITTED,
    description: 'direction submitted or received',
  })
  direction: ReceiptDirection;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReceiptCurrencyDto)
  @ApiProperty({
    name: 'currency',
    type: () => ReceiptCurrencyDto,
    required: true,
    example: {
      code: 'USD',
      exchangeRate: 50,
    },
    description: 'The invoice currency details',
  })
  currency: ReceiptCurrencyDto;

  @IsNotEmpty()
  @IsEnum(ReceiptStatus)
  @ApiProperty({
    name: 'status',
    type: String,
    required: true,
    example: ReceiptStatus.ISSUED,
    description: 'Status of the receipt',
  })
  status: ReceiptStatus;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'discount',
    type: Number,
    required: true,
    example: 66,
    description: 'The total discount applied',
  })
  discount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    name: 'additionalDiscount',
    type: Number,
    required: true,
    example: 99,
    description: 'The additionalDiscount applied',
  })
  additionalDiscount?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'tax',
    type: Number,
    required: true,
    example: 300,
    description: 'Total Taxes applied',
  })
  tax: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'grossAmount',
    type: Number,
    required: true,
    example: 300,
    description: 'The total cost of all products or services before taxes and discounts',
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
    name: 'paidAmount',
    type: Number,
    required: true,
    example: 300,
    description: 'The amount that has been paid',
  })
  paidAmount: number;

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
  @IsString()
  @ApiProperty({
    name: 'notes',
    type: String,
    required: false,
    example: 'The client paid in cash',
    description: 'Notes or comments related to the receipt',
  })
  notes?: string;

  @ArrayMaxSize(300)
  @ValidateNested({ each: true })
  @Type(() => ReceiptItemDto)
  items?: ReceiptItemDto[]; // This will contain the child lines

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'reference',
    type: String,
    required: false,
    example: '1234567890',
    description: 'A reference id  associated with the old receipts incase return receipt (team-member manually select them)',
  })
  reference?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'issuedAt',
    type: Number,
    required: true,
    example: 3500,
    description: 'The timestamp of when the receipt was issued',
  })
  issuedAt: number;

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

  @IsNotEmpty()
  @IsEnum(Authority)
  @ApiProperty({
    name: 'authority',
    type: String,
    required: true,
    example: Authority.ETA,
    description: 'Tax authority data for that receipt',
  })
  authority: Authority;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'posId',
    type: String,
    required: true,
    example: 'as14d5ad5ad5',
    description: 'Selected pos device id',
  })
  posId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'uuid',
    type: String,
    required: false,
    example: 'dsf1-ds1f5-4sd1f-ds54f',
    description: 'Authority receipt uuid',
  })
  uuid: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'submissionUuid',
    type: String,
    required: false,
    example: 'A19F5XPECKCZY0KAXHXM7NEJ10',
    description: 'Authority receipt uuid',
  })
  submissionUuid?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @ApiProperty({
    name: 'errorReasons',
    type: Array<string>,
    required: false,
    example: ['Invalid data', 'Invalid amount'],
    description: 'Errors Reasons',
  })
  errorReasons?: string[]; // List of error reasons if the receipt was rejected

  @IsOptional()
  @ApiProperty({
    name: 'rejectedSubmission',
    // type: any,
    required: false,
    example: [
      {
        internalId: '43652',
        error: {
          code: '1',
          target: '43652',
          message: 'Validation Error',
          details: [
            {
              code: 'CF313',
              message: 'Issuance date time value is out of the range of submission workflow parameter',
              propertyPath: 'document.datetimeissued',
              target: 'DatetimeIssued',
            },
          ],
        },
      },
    ],
    description: 'Copy of submission error response from ETA',
  })
  rejectedSubmission?: any; // The rejected submission object

  @IsNotEmpty()
  @IsEnum(TaxInvoiceStatus)
  @ApiProperty({
    name: 'taxStatus',
    type: String,
    required: true,
    example: TaxInvoiceStatus.ACCEPTED,
    description: 'Tax authority status',
  })
  taxStatus: TaxInvoiceStatus;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    name: 'url',
    type: String,
    required: false,
    example:
      'http://invoicing.eta.gov.eg/receipts/search/68e656b251e67e8358bef8483ab0d51c6619f3e7a1a9f0e75838d41ff368f320/share/2022-02-19T02:00Z#Total:1000.000,IssuerRIN:674859545',
    description: 'Tax receipt public URL',
  })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'activityCode',
    type: String,
    required: false,
    example: '6250',
    description: 'Tax activity code',
  })
  activityCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'uuidReference',
    type: String,
    required: false,
    example: 's5d4as4as54d',
    description: 'Uuid references for the receipt in ETA',
  })
  uuidReference?: string; // List of uuid references for the receipt

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
