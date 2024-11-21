/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { CODE_REPOSITORY_PROVIDER, ICodeService } from '../../domain';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsCodeExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(CODE_REPOSITORY_PROVIDER)
    private readonly codeService: ICodeService,
  ) {}

  async validate(code: { id: string; organizationId: string }, args: ValidationArguments): Promise<boolean> {
    if (typeof code.id !== 'string') return false;
    return !!(await this.codeService.getCode(code.id, code.organizationId));
  }

  defaultMessage(args: ValidationArguments): string {
    return 'code does not exist';
  }
}

export function IsCodeExist(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCodeExistConstraint,
    });
  };
}
