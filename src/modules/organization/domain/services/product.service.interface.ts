import { Product } from '../entities';

export interface IOrganizationProductService {
  getProducts(organizationId: string): Promise<Product[]>;
  getProduct(id: string, organizationId: string): Promise<Product>;
  addProduct(branch: Partial<Product> & { organizationId: string }): Promise<Product>;
  updateProduct(branch: Partial<Product> & { id: string; organizationId: string }): Promise<Product>;
  deleteProduct(id: string, organizationId: string): Promise<Product>;
}
