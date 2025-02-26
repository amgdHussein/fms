import { Branch } from '../../../domain';
import { PosDevice } from '../../../domain/entities/branch.entity';

// TODO: FILL THE DTO
export class BranchDto implements Branch {
  id: string;
  organizationId: string;
  branchCode: string;
  name: string;
  posDevices?: PosDevice[];
  street: string;
  city: string;
  country: string;
  governorate?: string;
  postalCode?: string;

  buildingNumber: string;
  floor?: string;
  room?: string;
  landmark?: string;
  additionalInformation?: string; //TODO: ADD TO ALL FORMS

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
