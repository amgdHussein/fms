import { Injectable } from '@nestjs/common';
import { PaypalService } from '../../infrastructure';

@Injectable()
export class HandleResponseUseCase {
  constructor(private paypalService: PaypalService) {}
  async execute(response: any): Promise<any> {
    return await this.paypalService.handleResponse(response);
  }
}
