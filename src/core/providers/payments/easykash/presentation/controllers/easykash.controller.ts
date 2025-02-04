import { Body, Controller, Post } from '@nestjs/common';
import { EasykashService } from '../..';
import { ProcessPaymentDto, ProcessPaymentResponseDto } from '../dto';

@Controller('easykash')
export class EasykashController {
  constructor(private readonly easykashService: EasykashService) {}

  @Post('process_payment')
  async processPayment(
    @Body() req: ProcessPaymentDto,
  ): Promise<ProcessPaymentResponseDto> {
    try {
      const result = await this.easykashService.processPayment(req);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error processing payment:', error);
      return { success: false, message: 'Internal Server Error' };
    }
  }
}
