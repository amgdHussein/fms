import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationProductService, Product, PRODUCT_SERVICE_PROVIDER, ProductStatus } from '../../../domain';

@Injectable()
export class DraftProduct implements Usecase<Product> {
  constructor(
    @Inject(PRODUCT_SERVICE_PROVIDER)
    private readonly productService: IOrganizationProductService,
  ) {}

  async execute(product: Partial<Product> & { organizationId: string }): Promise<Product> {
    product.status = ProductStatus.DRAFT;
    return this.productService.addProduct(product);
  }
}
