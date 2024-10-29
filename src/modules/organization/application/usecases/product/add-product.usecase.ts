import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { BRANCH_SERVICE_PROVIDER, IOrganizationProductService, Product } from '../../../domain';

@Injectable()
export class AddProduct implements Usecase<Product> {
  constructor(
    @Inject(BRANCH_SERVICE_PROVIDER)
    private readonly productService: IOrganizationProductService,
  ) {}

  async execute(product: Partial<Product> & { organizationId: string }): Promise<Product> {
    return this.productService.addProduct(product);
  }
}
