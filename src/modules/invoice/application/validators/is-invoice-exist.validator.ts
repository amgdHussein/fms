/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { IInvoiceService, INVOICE_REPOSITORY_PROVIDER } from '../../domain';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsInvoiceExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(INVOICE_REPOSITORY_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async validate(invoiceId: string, args: ValidationArguments): Promise<boolean> {
    if (typeof invoiceId !== 'string') return false;
    return !!(await this.invoiceService.getInvoice(invoiceId));
  }

  defaultMessage(args: ValidationArguments): string {
    return 'invoice does not exist';
  }
}

export function IsInvoiceExist(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsInvoiceExistConstraint,
    });
  };
}
