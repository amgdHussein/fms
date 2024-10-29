import { Inject, Injectable } from '@nestjs/common';

import { BRANCH_REPOSITORY_PROVIDER, IOrganizationProductRepository, IOrganizationProductService, Product } from '../../domain';

@Injectable()
export class OrganizationProductService implements IOrganizationProductService {
  constructor(
    @Inject(BRANCH_REPOSITORY_PROVIDER)
    private readonly repo: IOrganizationProductRepository,
  ) {}

  async getProduct(id: string, organizationId: string): Promise<Product> {
    return this.repo.get(id, organizationId);
  }

  async getProducts(organizationId: string): Promise<Product[]> {
    return this.repo.getMany(organizationId);
  }

  async addProduct(product: Partial<Product> & { organizationId: string }): Promise<Product> {
    return this.repo.add(product);
  }

  async updateProduct(product: Partial<Product> & { id: string; organizationId: string }): Promise<Product> {
    return this.repo.update(product);
  }

  async deleteProduct(id: string, organizationId: string): Promise<Product> {
    return this.repo.delete(id, organizationId);
  }
}
