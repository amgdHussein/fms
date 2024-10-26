/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { IOrganizationService, ORGANIZATION_REPOSITORY_PROVIDER } from '../../domain';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsOrganizationExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY_PROVIDER)
    private readonly organizationService: IOrganizationService,
  ) {}

  async validate(organizationId: string, args: ValidationArguments): Promise<boolean> {
    if (typeof organizationId !== 'string') return false;
    return !!(await this.organizationService.getOrganization(organizationId));
  }

  defaultMessage(args: ValidationArguments): string {
    return 'organization does not exist';
  }
}

export function IsOrganizationExist(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOrganizationExistConstraint,
    });
  };
}
