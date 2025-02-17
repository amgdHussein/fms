import { Global, Module } from '@nestjs/common';

import {
  AddBillingAccount,
  AddBranches,
  AddOrganization,
  AddProduct,
  AssignOrganizationTax,
  DeleteBillingAccount,
  DeleteBranch,
  DeleteOrganization,
  DeleteProduct,
  GetBillingAccount,
  GetBillingAccounts,
  GetBranch,
  GetBranches,
  GetOrganization,
  GetOrganizationPreferences,
  GetOrganizations,
  GetOrganizationTax,
  GetProduct,
  GetProducts,
  IsOrganizationExistConstraint,
  UpdateBillingAccount,
  UpdateBranch,
  UpdateOrganization,
  UpdateOrganizationPreferences,
  UpdateOrganizationTax,
  UpdateProduct,
  ValidateAuthorityTaxNumber,
} from './application';
import { DraftProduct } from './application/usecases/product/draft-product.usecase';
import {
  BILLING_ACCOUNT_REPOSITORY_PROVIDER,
  BILLING_ACCOUNT_SERVICE_PROVIDER,
  BILLING_ACCOUNT_USECASE_PROVIDERS,
  BRANCH_REPOSITORY_PROVIDER,
  BRANCH_SERVICE_PROVIDER,
  BRANCH_USECASE_PROVIDERS,
  ORGANIZATION_PREFERENCES_REPOSITORY_PROVIDER,
  ORGANIZATION_PREFERENCES_SERVICE_PROVIDER,
  ORGANIZATION_PREFERENCES_USECASE_PROVIDERS,
  ORGANIZATION_REPOSITORY_PROVIDER,
  ORGANIZATION_SERVICE_PROVIDER,
  ORGANIZATION_TAX_REPOSITORY_PROVIDER,
  ORGANIZATION_TAX_SERVICE_PROVIDER,
  ORGANIZATION_TAX_USECASE_PROVIDERS,
  ORGANIZATION_USECASE_PROVIDERS,
  PRODUCT_REPOSITORY_PROVIDER,
  PRODUCT_SERVICE_PROVIDER,
  PRODUCT_USECASE_PROVIDERS,
} from './domain';
import {
  BillingAccountFirestoreRepository,
  BillingAccountService,
  BranchFirestoreRepository,
  BranchService,
  OrganizationFirestoreRepository,
  OrganizationPreferencesFirestoreRepository,
  OrganizationPreferencesService,
  OrganizationProductFirestoreRepository,
  OrganizationProductService,
  OrganizationService,
  OrganizationTaxFirestoreRepository,
  OrganizationTaxService,
} from './infrastructure';
import {
  BillingAccountController,
  BranchController,
  OrganizationController,
  OrganizationPreferencesController,
  OrganizationProductController,
  OrganizationTaxController,
} from './presentation';

const validators = [IsOrganizationExistConstraint];
const organizationUsecases = [
  {
    provide: ORGANIZATION_USECASE_PROVIDERS.GET_ORGANIZATION,
    useClass: GetOrganization,
  },
  {
    provide: ORGANIZATION_USECASE_PROVIDERS.ADD_ORGANIZATION,
    useClass: AddOrganization,
  },
  {
    provide: ORGANIZATION_USECASE_PROVIDERS.UPDATE_ORGANIZATION,
    useClass: UpdateOrganization,
  },
  {
    provide: ORGANIZATION_USECASE_PROVIDERS.GET_ORGANIZATIONS,
    useClass: GetOrganizations,
  },
  {
    provide: ORGANIZATION_USECASE_PROVIDERS.DELETE_ORGANIZATION,
    useClass: DeleteOrganization,
  },
];
const preferencesUsecases = [
  {
    provide: ORGANIZATION_PREFERENCES_USECASE_PROVIDERS.GET_ORGANIZATION_PREFERENCES,
    useClass: GetOrganizationPreferences,
  },
  {
    provide: ORGANIZATION_PREFERENCES_USECASE_PROVIDERS.UPDATE_ORGANIZATION_PREFERENCES,
    useClass: UpdateOrganizationPreferences,
  },
];
const branchesUsecases = [
  {
    provide: BRANCH_USECASE_PROVIDERS.GET_BRANCH,
    useClass: GetBranch,
  },
  {
    provide: BRANCH_USECASE_PROVIDERS.ADD_BRANCHES,
    useClass: AddBranches,
  },
  {
    provide: BRANCH_USECASE_PROVIDERS.UPDATE_BRANCH,
    useClass: UpdateBranch,
  },
  {
    provide: BRANCH_USECASE_PROVIDERS.GET_BRANCHES,
    useClass: GetBranches,
  },
  {
    provide: BRANCH_USECASE_PROVIDERS.DELETE_BRANCH,
    useClass: DeleteBranch,
  },
];
const productsUsecases = [
  {
    provide: PRODUCT_USECASE_PROVIDERS.GET_PRODUCT,
    useClass: GetProduct,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.ADD_PRODUCT,
    useClass: AddProduct,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.DRAFT_PRODUCT,
    useClass: DraftProduct,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.UPDATE_PRODUCT,
    useClass: UpdateProduct,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.GET_PRODUCTS,
    useClass: GetProducts,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.DELETE_PRODUCT,
    useClass: DeleteProduct,
  },
];
const organizationTaxUsecases = [
  {
    provide: ORGANIZATION_TAX_USECASE_PROVIDERS.GET_ORGANIZATION_TAX,
    useClass: GetOrganizationTax,
  },
  {
    provide: ORGANIZATION_TAX_USECASE_PROVIDERS.VALIDATE_AUTHORITY_TAX_NUMBER,
    useClass: ValidateAuthorityTaxNumber,
  },
  {
    provide: ORGANIZATION_TAX_USECASE_PROVIDERS.ASSIGN_ORGANIZATION_TAX,
    useClass: AssignOrganizationTax,
  },
  {
    provide: ORGANIZATION_TAX_USECASE_PROVIDERS.UPDATE_ORGANIZATION_TAX,
    useClass: UpdateOrganizationTax,
  },
];
const organizationBillingAccountUsecases = [
  {
    provide: BILLING_ACCOUNT_USECASE_PROVIDERS.ADD_BILLING_ACCOUNT,
    useClass: AddBillingAccount,
  },
  {
    provide: BILLING_ACCOUNT_USECASE_PROVIDERS.GET_BILLING_ACCOUNT,
    useClass: GetBillingAccount,
  },
  {
    provide: BILLING_ACCOUNT_USECASE_PROVIDERS.GET_BILLING_ACCOUNTS,
    useClass: GetBillingAccounts,
  },
  {
    provide: BILLING_ACCOUNT_USECASE_PROVIDERS.UPDATE_BILLING_ACCOUNT,
    useClass: UpdateBillingAccount,
  },
  {
    provide: BILLING_ACCOUNT_USECASE_PROVIDERS.DELETE_BILLING_ACCOUNT,
    useClass: DeleteBillingAccount,
  },
];

@Global()
@Module({
  controllers: [
    OrganizationController,
    OrganizationPreferencesController,
    OrganizationTaxController,
    BillingAccountController,
    BranchController,
    OrganizationProductController,
  ],
  providers: [
    ...validators,

    {
      provide: ORGANIZATION_REPOSITORY_PROVIDER,
      useClass: OrganizationFirestoreRepository,
    },
    {
      provide: ORGANIZATION_SERVICE_PROVIDER,
      useClass: OrganizationService,
    },
    {
      provide: ORGANIZATION_TAX_REPOSITORY_PROVIDER,
      useClass: OrganizationTaxFirestoreRepository,
    },
    {
      provide: ORGANIZATION_TAX_SERVICE_PROVIDER,
      useClass: OrganizationTaxService,
    },
    {
      provide: ORGANIZATION_PREFERENCES_REPOSITORY_PROVIDER,
      useClass: OrganizationPreferencesFirestoreRepository,
    },
    {
      provide: ORGANIZATION_PREFERENCES_SERVICE_PROVIDER,
      useClass: OrganizationPreferencesService,
    },
    {
      provide: BRANCH_REPOSITORY_PROVIDER,
      useClass: BranchFirestoreRepository,
    },
    {
      provide: BRANCH_SERVICE_PROVIDER,
      useClass: BranchService,
    },
    {
      provide: PRODUCT_REPOSITORY_PROVIDER,
      useClass: OrganizationProductFirestoreRepository,
    },
    {
      provide: PRODUCT_SERVICE_PROVIDER,
      useClass: OrganizationProductService,
    },
    {
      provide: BILLING_ACCOUNT_REPOSITORY_PROVIDER,
      useClass: BillingAccountFirestoreRepository,
    },
    {
      provide: BILLING_ACCOUNT_SERVICE_PROVIDER,
      useClass: BillingAccountService,
    },
    ...organizationUsecases,
    ...preferencesUsecases,
    ...branchesUsecases,
    ...productsUsecases,
    ...organizationTaxUsecases,
    ...organizationBillingAccountUsecases,
  ],
  exports: [
    {
      provide: ORGANIZATION_SERVICE_PROVIDER,
      useClass: OrganizationService,
    },
    {
      provide: PRODUCT_SERVICE_PROVIDER,
      useClass: OrganizationProductService,
    },
    {
      provide: BRANCH_SERVICE_PROVIDER,
      useClass: BranchService,
    },
    {
      provide: ORGANIZATION_TAX_SERVICE_PROVIDER,
      useClass: OrganizationTaxService,
    },
  ],
})
export class OrganizationModule {}
