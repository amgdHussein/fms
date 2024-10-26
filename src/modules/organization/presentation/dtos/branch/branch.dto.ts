import { OrganizationBranch } from '../../../domain';

// TODO: Fill the DTO
export class OrganizationBranchDto implements OrganizationBranch {
  id: string;
  systemId: string;
  branchId: string;
  name: string;
  street: string;
  city: string;
  country: string;
  governorate: string;
  postalCode?: string;
  buildingNumber?: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
