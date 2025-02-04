import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { AddReceiptDto } from './add-receipt.dto';

export class AddReceiptsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddReceiptDto)
  @ApiProperty({
    name: 'payments',
    type: AddReceiptDto,
    required: true,
    description: 'Array of receipt to set.',
  })
  receipts: AddReceiptDto[];
}
