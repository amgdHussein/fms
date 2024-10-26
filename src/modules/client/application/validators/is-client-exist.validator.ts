/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { CLIENT_SERVICE_PROVIDER, IClientService } from '../../domain';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsClientExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,
  ) {}

  async validate(clientId: string, args: ValidationArguments): Promise<boolean> {
    if (typeof clientId !== 'string') return false;
    return !!(await this.clientService.getClient(clientId));
  }

  defaultMessage(args: ValidationArguments): string {
    return 'client does not exist';
  }
}

export function IsClientExist(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsClientExistConstraint,
    });
  };
}
