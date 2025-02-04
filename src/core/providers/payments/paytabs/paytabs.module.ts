import { Module } from '@nestjs/common';
import { PaytabsService } from './infrastructure';

@Module({
  providers: [PaytabsService],
})
export class PaytabsModule {
  constructor() {}
}
