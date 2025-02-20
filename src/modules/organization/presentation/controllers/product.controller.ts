import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AddProduct, AddProducts, DeleteProduct, GetProduct, GetProducts, UpdateProduct, UpdateProducts } from '../../application';
import { PRODUCT_USECASE_PROVIDERS } from '../../domain';

import { DraftProduct } from '../../application/usecases/product/draft-product.usecase';
import {
  AddOrganizationProductDto,
  AddOrganizationProductsDto,
  OrganizationProductDto,
  UpdateOrganizationProductDto,
  UpdateOrganizationProductsDto,
} from '../dtos';

@ApiTags('Products')
@Controller()
export class OrganizationProductController {
  constructor(
    @Inject(PRODUCT_USECASE_PROVIDERS.GET_PRODUCT)
    private readonly getProductUsecase: GetProduct,

    @Inject(PRODUCT_USECASE_PROVIDERS.ADD_PRODUCT)
    private readonly addProductUsecase: AddProduct,

    @Inject(PRODUCT_USECASE_PROVIDERS.ADD_PRODUCTS)
    private readonly addProductsUsecase: AddProducts,

    @Inject(PRODUCT_USECASE_PROVIDERS.DRAFT_PRODUCT)
    private readonly draftProductUsecase: DraftProduct,

    @Inject(PRODUCT_USECASE_PROVIDERS.UPDATE_PRODUCT)
    private readonly updateProductUsecase: UpdateProduct,

    @Inject(PRODUCT_USECASE_PROVIDERS.UPDATE_PRODUCTS)
    private readonly updateProductsUsecase: UpdateProducts,

    @Inject(PRODUCT_USECASE_PROVIDERS.DELETE_PRODUCT)
    private readonly deleteProductUsecase: DeleteProduct,

    @Inject(PRODUCT_USECASE_PROVIDERS.GET_PRODUCTS)
    private readonly getProductsUsecase: GetProducts,
  ) {}

  @Get('organizations/:organizationId/products/:productId')
  @ApiOperation({ summary: 'Retrieve a specific product by ID within an organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiParam({
    name: 'productId',
    type: String,
    example: 'P12345',
    required: true,
    description: 'The unique identifier of the product within the organization.',
  })
  @ApiResponse({
    type: OrganizationProductDto,
    description: 'Details of the product with the specified ID.',
  })
  async getProduct(@Param('organizationId') organizationId: string, @Param('productId') productId: string): Promise<OrganizationProductDto> {
    return this.getProductUsecase.execute(productId, organizationId);
  }

  //TODO: ADD FILTERS AND PAGINATION
  @Get('organizations/:organizationId/products')
  @ApiOperation({ summary: 'Retrieve all products for a specific organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiResponse({
    type: [OrganizationProductDto],
    description: 'List of all products associated with the organization.',
  })
  async getOrganizationProducts(@Param('organizationId') organizationId: string): Promise<OrganizationProductDto[]> {
    return this.getProductsUsecase.execute(organizationId);
  }

  @Post('organizations/:organizationId/products')
  @ApiOperation({ summary: 'Create a new product for a specific organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiBody({
    type: AddOrganizationProductDto,
    required: true,
    description: 'Details required to create a new product within the organization.',
  })
  @ApiResponse({
    type: OrganizationProductDto,
    description: 'The newly created product.',
  })
  async addProduct(@Param('organizationId') organizationId: string, @Body() dto: AddOrganizationProductDto): Promise<OrganizationProductDto> {
    return this.addProductUsecase.execute({ ...dto, organizationId });
  }

  @Post('organizations/:organizationId/products/draft')
  @ApiOperation({ summary: 'Create a new draft product for a specific organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiBody({
    type: AddOrganizationProductDto,
    required: true,
    description: 'Details required to create a new product within the organization.',
  })
  @ApiResponse({
    type: OrganizationProductDto,
    description: 'The newly created product.',
  })
  async addDraftProduct(@Param('organizationId') organizationId: string, @Body() dto: AddOrganizationProductDto): Promise<OrganizationProductDto> {
    return this.draftProductUsecase.execute({ ...dto, organizationId });
  }

  @Put('organizations/:organizationId/products/:productId')
  @ApiOperation({ summary: 'Update an existing product within an organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiParam({
    name: 'productId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the product within the organization.',
  })
  @ApiBody({
    type: UpdateOrganizationProductDto,
    required: true,
    description: 'Details of the product to be updated.',
  })
  @ApiResponse({
    type: OrganizationProductDto,
    description: 'The updated product details.',
  })
  async updateProduct(
    @Param('organizationId') organizationId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateOrganizationProductDto,
  ): Promise<OrganizationProductDto> {
    return this.updateProductUsecase.execute({ ...dto, organizationId, id: productId });
  }

  @Delete('organizations/:organizationId/products/:productId')
  @ApiOperation({ summary: 'Delete a specific product by ID from an organization.' })
  @ApiParam({
    name: 'organizationId',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the organization.',
  })
  @ApiParam({
    name: 'productId',
    type: String,
    example: 'P12345',
    required: true,
    description: 'The unique identifier of the product to be deleted.',
  })
  @ApiResponse({
    type: OrganizationProductDto,
    description: 'Details of the deleted product.',
  })
  async deleteProduct(@Param('organizationId') organizationId: string, @Param('productId') productId: string): Promise<OrganizationProductDto> {
    return this.deleteProductUsecase.execute(productId, organizationId);
  }

  //TODO: REVISE
  @Post('organizations/:organizationId/products/add/bulk')
  @ApiOperation({ summary: 'Add multiple Products in a batch.' })
  async addProducts(@Param('organizationId') organizationId: string, @Body() dto: AddOrganizationProductsDto): Promise<OrganizationProductDto[]> {
    return this.addProductsUsecase.execute(dto.products, organizationId);
  }

  //TODO: REVISE
  @Put('organizations/:organizationId/products/add/bulk')
  @ApiOperation({ summary: 'Add multiple Products in a batch.' })
  async updateProducts(@Param('organizationId') organizationId: string, @Body() dto: UpdateOrganizationProductsDto): Promise<OrganizationProductDto[]> {
    return this.updateProductsUsecase.execute(dto.products, organizationId);
  }
}
