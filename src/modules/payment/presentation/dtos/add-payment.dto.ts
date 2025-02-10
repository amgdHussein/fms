import { OmitType } from '@nestjs/swagger';
import { PaymentDto } from './payment.dto';

export class AddPaymentDto extends OmitType(PaymentDto, ['id', 'processedAt', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}
