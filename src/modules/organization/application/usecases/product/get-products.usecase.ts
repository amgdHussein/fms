import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { BRANCH_SERVICE_PROVIDER, IOrganizationProductService, Product } from '../../../domain';

@Injectable()
export class GetProducts implements Usecase<Product> {
  constructor(
    @Inject(BRANCH_SERVICE_PROVIDER)
    private readonly productService: IOrganizationProductService,
  ) {}

  async execute(organizationId: string): Promise<Product[]> {
    return this.productService.getProducts(organizationId);
  }
}
