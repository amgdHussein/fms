import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const SECRET_KEY = 'SECRET';
export function SecretKey(secretKey: string): CustomDecorator {
  return SetMetadata(SECRET_KEY, secretKey);
}
