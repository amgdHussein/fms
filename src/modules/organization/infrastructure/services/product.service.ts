import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/queries';
import { IOrganizationProductRepository, IOrganizationProductService, Product, PRODUCT_REPOSITORY_PROVIDER } from '../../domain';

@Injectable()
export class OrganizationProductService implements IOrganizationProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PROVIDER)
    private readonly repo: IOrganizationProductRepository,
  ) {}

  async getProduct(id: string, organizationId: string): Promise<Product> {
    return this.repo.get(id, organizationId);
  }

  async getProducts(organizationId: string, filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Product[]> {
    return this.repo.getMany(organizationId, filters, page, limit, order);
  }

  async addProduct(product: Partial<Product> & { organizationId: string }): Promise<Product> {
    return this.repo.add(product, product.organizationId);
  }

  async updateProduct(product: Partial<Product> & { id: string; organizationId: string }): Promise<Product> {
    return this.repo.update(product);
  }

  async deleteProduct(id: string, organizationId: string): Promise<Product> {
    return this.repo.delete(id, organizationId);
  }
}
