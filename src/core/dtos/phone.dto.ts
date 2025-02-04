import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Phone } from '../common';

export class PhoneDto implements Phone {
  @IsString()
  //@IsNotEmpty()
  @ApiProperty({
    name: 'iso',
    type: String,
    required: true,
    example: 'EG',
    description: 'The phone iso code',
  })
  iso: string;

  @IsString()
  //@IsNotEmpty()
  @ApiProperty({
    name: 'value',
    type: String,
    required: true,
    example: '1234567890',
    description: 'The phone number',
  })
  value: string;

  @IsNumber()
  //@IsNotEmpty()
  @ApiProperty({
    name: 'code',
    type: String,
    required: true,
    example: '20',
    description: 'The phone country code',
  })
  code: string;
}
