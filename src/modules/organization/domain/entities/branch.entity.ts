import { Address } from '../../../../core/common';

export interface OrganizationBranch extends Address {
  id: string;
  systemId: string;

  branchId: string; // Generate by Tax authority
  name: string; // Name of the branch

  createdBy: string; // User ID who created the branch
  createdAt: number; // Date when the branch was created
  updatedBy: string; // User ID who last updated the branch
  updatedAt: number; // Date when the branch was last updated
}
