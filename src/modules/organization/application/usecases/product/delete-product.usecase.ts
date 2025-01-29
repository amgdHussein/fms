import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationProductService, Product, PRODUCT_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class DeleteProduct implements Usecase<Product> {
  constructor(
    @Inject(PRODUCT_SERVICE_PROVIDER)
    private readonly productService: IOrganizationProductService,
  ) {}

  async execute(id: string, organizationId: string): Promise<Product> {
    return this.productService.deleteProduct(id, organizationId);
  }
}
