import { Global, Module } from '@nestjs/common';

import {
  AddBranch,
  AddOrganization,
  DeleteBranch,
  DeleteOrganization,
  GetBranch,
  GetBranches,
  GetOrganization,
  GetOrganizationPreferences,
  IsOrganizationExistConstraint,
  QueryOrganizations,
  UpdateBranch,
  UpdateOrganization,
  UpdateOrganizationPreferences,
} from './application';
import {
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
  ORGANIZATION_USECASE_PROVIDERS,
  PRODUCT_REPOSITORY_PROVIDER,
  PRODUCT_SERVICE_PROVIDER,
  PRODUCT_USECASE_PROVIDERS,
} from './domain';
import {
  OrganizationBranchFirestoreRepository,
  OrganizationBranchService,
  OrganizationFirestoreRepository,
  OrganizationPreferencesFirestoreRepository,
  OrganizationPreferencesService,
  OrganizationProductFirestoreRepository,
  OrganizationProductService,
  OrganizationService,
  OrganizationTaxFirestoreRepository,
  OrganizationTaxService,
} from './infrastructure';
import { OrganizationBranchController, OrganizationController, OrganizationPreferencesController, OrganizationProductController } from './presentation';

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
    provide: ORGANIZATION_USECASE_PROVIDERS.QUERY_ORGANIZATIONS,
    useClass: QueryOrganizations,
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
    provide: BRANCH_USECASE_PROVIDERS.ADD_BRANCH,
    useClass: AddBranch,
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
    useClass: GetBranch,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.ADD_PRODUCT,
    useClass: AddBranch,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.UPDATE_PRODUCT,
    useClass: UpdateBranch,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.GET_PRODUCTS,
    useClass: GetBranches,
  },
  {
    provide: PRODUCT_USECASE_PROVIDERS.DELETE_PRODUCT,
    useClass: DeleteBranch,
  },
];

@Global()
@Module({
  imports: [],
  controllers: [OrganizationController, OrganizationPreferencesController, OrganizationBranchController, OrganizationProductController],
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
      useClass: OrganizationBranchFirestoreRepository,
    },
    {
      provide: BRANCH_SERVICE_PROVIDER,
      useClass: OrganizationBranchService,
    },
    {
      provide: PRODUCT_REPOSITORY_PROVIDER,
      useClass: OrganizationProductFirestoreRepository,
    },
    {
      provide: PRODUCT_SERVICE_PROVIDER,
      useClass: OrganizationProductService,
    },

    ...organizationUsecases,
    ...preferencesUsecases,
    ...branchesUsecases,
    ...productsUsecases,
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
      useClass: OrganizationBranchService,
    },
    {
      provide: ORGANIZATION_TAX_SERVICE_PROVIDER,
      useClass: OrganizationTaxService,
    },
  ],
})
export class OrganizationModule {}
