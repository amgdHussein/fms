import { Address, CountryCode, Gender, Identification, Phone, Photo } from '../../../../../core/common';
import { User, UserRole, UserStatus } from '../../../domain/entities';

// TODO: FILL THE DTO
export class UserDto implements User {
  id: string;
  status: UserStatus;
  role: UserRole;
  avatar?: Photo;
  name: string;
  email: string;
  phone: Phone;
  address: Address;
  nationality: CountryCode;
  identification: Identification;
  dateOfBirth: number;
  gender: Gender;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
