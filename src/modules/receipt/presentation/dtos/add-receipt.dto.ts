import { OmitType } from '@nestjs/swagger';
import { ReceiptDto } from './receipt.dto';

export class AddReceiptDto extends OmitType(ReceiptDto, ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}
