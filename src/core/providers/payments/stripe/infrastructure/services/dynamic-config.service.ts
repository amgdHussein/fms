import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamicConfigService {
  private stripeApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.stripeApiKey = this.configService.get<string>('STRIPE_API_KEY');
  }

  getStripeApiKey(): string {
    return this.stripeApiKey;
  }

  setStripeApiKey(apiKey: string): void {
    this.stripeApiKey = apiKey;
  }
}
