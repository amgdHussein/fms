import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { AddPaymentDto } from './add-payment.dto';

export class AddPaymentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddPaymentDto)
  @ApiProperty({
    name: 'payments',
    type: AddPaymentDto,
    required: true,
    description: 'Array of payments to set.',
  })
  payments: AddPaymentDto[];
}
