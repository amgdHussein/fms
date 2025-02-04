import { OmitType } from '@nestjs/swagger';
import { PaymentDto } from './payment.dto';

export class AddPaymentDto extends OmitType(PaymentDto, ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}
