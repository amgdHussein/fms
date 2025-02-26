import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { CurrencyCode } from '../enums';
import { Currency } from '../models';

export class CurrencyDto implements Currency {
  @IsNotEmpty()
  @IsEnum(CurrencyCode)
  @ApiProperty({
    name: 'code',
    enum: CurrencyCode,
    required: true,
    example: CurrencyCode.EGP,
    description: 'Currency code used from ISO 4217.',
  })
  code: CurrencyCode;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'rate',
    type: Number,
    required: true,
    example: '50',
    description: 'Exchange rate of the Egyptian bank on the day of invoicing used to convert currency sold to the value of currency EGP',
  })
  rate: number;
}
