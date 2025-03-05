import { DynamicModule, Module, Provider } from '@nestjs/common';

import { STRIPE_PROVIDER } from '../../constants';
import { StripeConfigs } from './stripe.config';
import { StripeService } from './stripe.service';

@Module({})
export class StripeModule {
  /**
   * Creates a dynamic module for the Stripe integration using the provided configurations.
   *
   * @param {StripeConfigs} configs - The configurations for the Stripe integration.
   * @return {DynamicModule} The created dynamic module for the Stripe integration.
   */
  static forRoot(configs: StripeConfigs): DynamicModule {
    const stripeProvider: Provider = {
      provide: STRIPE_PROVIDER,
      useFactory: () => new StripeService(configs),
    };

    return {
      global: true,
      providers: [stripeProvider],
      exports: [stripeProvider],
      module: StripeModule,
    };
  }
}
