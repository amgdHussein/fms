import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { AddPaymentDto } from './add-payment.dto';
import { PaymentDto } from './payment.dto';

export class UpdatePaymentDto extends IntersectionType(PickType(PaymentDto, ['id']), PartialType(AddPaymentDto)) {}
