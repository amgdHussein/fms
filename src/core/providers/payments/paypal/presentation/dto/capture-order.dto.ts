import { ApiProperty } from '@nestjs/swagger';

export class PaypalTokenResponseDto {
  @ApiProperty({ description: 'The scope of the access token' })
  scope: string;

  @ApiProperty({ description: 'A unique value generated by the client' })
  nonce: string;

  @ApiProperty({ description: 'The access token issued by PayPal' })
  access_token: string;

  @ApiProperty({ description: 'The type of the access token issued' })
  token_type: string;

  @ApiProperty({ description: 'The PayPal app ID' })
  app_id: string;

  @ApiProperty({ description: 'The lifetime in seconds of the access token' })
  expires_in: number;
}
