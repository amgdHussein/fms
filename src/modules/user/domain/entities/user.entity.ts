import { Address, Phone, Photo } from '../../../../core/common';

import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

export interface User {
  id: string;
  preferencesId: string;

  status: UserStatus;
  role: UserRole;
  avatar?: Photo; // Avatar

  name: string; // First name and last name
  email: string;
  phone: Phone; // Phone object
  address: Address; // Address object
  dateOfBirth: number; // Date of birth
  gender: string; // Gender
  nationality: string; // Nationality

  searchTerms: string[]; // Keys for search

  createdBy: string; // User who created the user
  createdAt: number; // Timestamp when the user was created
  updatedBy: string; // User who last updated the user
  updatedAt: number; // Timestamp when the user was last updated
}
