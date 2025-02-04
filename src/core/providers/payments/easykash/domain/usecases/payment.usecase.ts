import { Injectable } from '@nestjs/common';
import { EasykashService } from '../../infrastructure';
import { ProcessPaymentDto } from '../../presentation/dto';

@Injectable()
export class PaymentUseCase {
  constructor(private readonly easykashService: EasykashService) {}

  async processPayment(dto: ProcessPaymentDto): Promise<any> {
    try {
      const result = await this.easykashService.processPayment(dto);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error processing payment in use case:', error);
      throw new Error('Internal Server Error');
    }
  }
}
