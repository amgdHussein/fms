export const FIRESTORE_PROVIDER = 'FIRESTORE_PROVIDER';
export const FIRESTORE_OPTIONS_PROVIDER = 'FIRESTORE_OPTIONS_PROVIDER';
export enum FIRESTORE_COLLECTION_PROVIDERS {
  // ? Logging Related
  LOGS = 'logs',
  EVENTS = 'events',

  // ? User Related
  USERS = 'users',
  USERS_PREFERENCES = 'users-preferences',

  // ? Organization Related
  ORGANIZATIONS = 'organizations',
  BRANCHES = 'branches',
  ORGANIZATIONS_PREFERENCES = 'organizations-preferences',

  // ? Organization Related
  ORGANIZATIONS_TAXES = 'organizations-taxes',

  // ? Organization Account Related
  ACCOUNTS = 'accounts',
  ACCOUNTS_PREFERENCES = 'accounts-preferences',

  // ? Client Related
  CLIENTS = 'clients',
  CLIENTS_PREFERENCES = 'clients-preferences',

  // ? Client Account Related
  CLIENTS_TAXES = 'clients-taxes',

  // ? Invoice Related
  INVOICES = 'invoices',
  SIGNATURES = 'signatures',
  SUBMISSIONS = 'submissions',

  // ? Receipts Related
  RECEIPTS = 'receipts',

  PAYMENTS = 'payments',
}

export const FIRESTORE_QUERY_MAX_LIMIT = 1e2;
