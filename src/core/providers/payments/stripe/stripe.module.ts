import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../../auth';
import { DynamicConfigService, StripeService } from './infrastructure';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      controllers: [],
      imports: [AuthModule, ConfigModule.forRoot()],
      providers: [
        StripeService,
        DynamicConfigService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: async (dynamicConfigService: DynamicConfigService) => dynamicConfigService.getStripeApiKey(),
          inject: [DynamicConfigService],
        },
      ],
    };
  }
}
