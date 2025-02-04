import { Injectable } from '@nestjs/common';
import { PaypalService } from '../../infrastructure/services/paypal.service';

@Injectable()
export class GenerateAccessTokenUseCase {
  constructor(private readonly paypalService: PaypalService) {}

  async execute(): Promise<string> {
    return this.paypalService.generateAccessToken();
  }
}
