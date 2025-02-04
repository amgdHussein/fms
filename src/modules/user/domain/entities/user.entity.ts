import { CountryCode, Identification, Phone, Photo } from '../../../../core/common';

import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

export interface User {
  id: string;
  status: UserStatus;
  role: UserRole;
  avatar?: Photo; // Avatar
  name: string; // First name and last name
  email: string;
  phone: Phone; // Phone object
  country: CountryCode; // Address object
  identification: Identification;
  // nationality: CountryCode; // Nationality
  // dateOfBirth: number; // Date of birth
  // gender: Gender;
  createdBy: string; // User who created the user
  createdAt: number; // Timestamp when the user was created
  updatedBy: string; // User who last updated the user
  updatedAt: number; // Timestamp when the user was last updated
  deletedAt?: number; // Timestamp when the user was deleted
  deletedBy?: string; // User who deleted the user
}
