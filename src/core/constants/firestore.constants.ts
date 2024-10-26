export const FIRESTORE_PROVIDER = 'FIRESTORE_PROVIDER';
export const FIRESTORE_OPTIONS_PROVIDER = 'FIRESTORE_OPTIONS_PROVIDER';
export enum FIRESTORE_COLLECTION_PROVIDERS {
  // ? User Related
  USERS = 'users',
  USERS_PREFERENCES = 'users-preferences',

  // ? Organization Related
  ORGANIZATIONS = 'organizations',
  BRANCHES = 'branches',
  ORGANIZATIONS_PREFERENCES = 'organizations-preferences',
}

export const FIRESTORE_QUERY_MAX_LIMIT = 1e2;
