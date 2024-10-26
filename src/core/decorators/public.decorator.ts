import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'PUBLIC';

export function Public(): CustomDecorator {
  return SetMetadata(PUBLIC_KEY, true);
}
