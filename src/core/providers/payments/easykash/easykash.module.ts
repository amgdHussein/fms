import { Module } from '@nestjs/common';
import { EasykashController } from './presentation';
import { EasykashService } from './infrastructure';

@Module({
  controllers: [EasykashController],
  providers: [EasykashService],
})
export class EasykashModule {}
