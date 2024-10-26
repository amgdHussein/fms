import { Address, Phone, Photo } from '../../../../../core/common';
import { User, UserRole, UserStatus } from '../../../domain/entities';

// TODO: Fill the DTO
export class UserDto implements User {
  id: string;
  preferencesId: string;

  role: UserRole;
  status: UserStatus;
  avatar?: Photo;
  name: string;
  email: string;
  phone: Phone;
  address: Address;
  dateOfBirth: number;
  gender: string;
  nationality: string;

  searchTerms: string[];

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
