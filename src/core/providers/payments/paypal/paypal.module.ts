import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PaypalController, PaypalService } from '.';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      // Optional: configure additional options for HttpModule
    }),
  ],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
