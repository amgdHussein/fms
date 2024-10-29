import { Module } from '@nestjs/common';

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
  ORGANIZATION_USECASE_PROVIDERS,
} from './domain';
import {
  OrganizationFirestoreRepository,
  OrganizationPreferencesFirestoreRepository,
  OrganizationPreferencesService,
  OrganizationService,
} from './infrastructure';
import { OrganizationBranchController, OrganizationController, OrganizationPreferencesController } from './presentation';

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
@Module({
  imports: [],
  controllers: [OrganizationController, OrganizationPreferencesController, OrganizationBranchController],
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
      provide: ORGANIZATION_PREFERENCES_REPOSITORY_PROVIDER,
      useClass: OrganizationPreferencesFirestoreRepository,
    },
    {
      provide: ORGANIZATION_PREFERENCES_SERVICE_PROVIDER,
      useClass: OrganizationPreferencesService,
    },
    {
      provide: BRANCH_REPOSITORY_PROVIDER,
      useClass: OrganizationFirestoreRepository,
    },
    {
      provide: BRANCH_SERVICE_PROVIDER,
      useClass: OrganizationService,
    },

    ...organizationUsecases,
    ...preferencesUsecases,
    ...branchesUsecases,
  ],
  exports: [
    {
      provide: ORGANIZATION_SERVICE_PROVIDER,
      useClass: OrganizationService,
    },
  ],
})
export class OrganizationModule {}
