import { ApiProperty } from '@nestjs/swagger';

export class PaypalCreateOrderResponseDto {
  @ApiProperty({ description: 'The unique identifier for the order' })
  id: string;

  @ApiProperty({ description: 'The status of the order' })
  status: string;

  @ApiProperty({
    description: 'An array of links related to the order',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    type: () => [LinkDto],
  })
  links: LinkDto[];
}

class LinkDto {
  @ApiProperty()
  href: string;

  @ApiProperty()
  rel: string;

  @ApiProperty()
  method: string;
}
