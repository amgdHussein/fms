import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { AddReceiptDto } from './add-receipt.dto';
import { ReceiptDto } from './receipt.dto';

export class UpdateReceiptDto extends IntersectionType(PickType(ReceiptDto, ['id']), PartialType(AddReceiptDto)) {}
