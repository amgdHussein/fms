import { Product } from '../entities';

export interface IOrganizationProductService {
  getProducts(organizationId: string): Promise<Product[]>;
  getProduct(id: string, organizationId: string): Promise<Product>;
  addProduct(product: Partial<Product> & { organizationId: string }): Promise<Product>;
  addProducts(products: Partial<Product>[], organizationId: string): Promise<Product[]>;
  updateProduct(product: Partial<Product> & { id: string; organizationId: string }): Promise<Product>;
  updateProducts(product: Partial<Product>[], organizationId: string): Promise<Product[]>;
  deleteProduct(id: string, organizationId: string): Promise<Product>;
}
