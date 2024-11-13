export interface Usage {
  id: string;
  systemId: string; // Unique ID for the organization(system)
  subscriptionId: string; // ID of the subscription associated with the usage

  type: UsageType; // Type of usage
  used: number; // Amount of usage
  remaining: number; // Remaining amount of usage
  limit: number; // Maximum amount of usage

  createdBy: string; // User who created the user
  createdAt: number; // Timestamp when the user was created
  updatedBy: string; // User who last updated the user
  updatedAt: number; // Timestamp when the user was last updated
}

export enum UsageType {
  MEMBERS = 'members',
  CLIENTS = 'clients',
  SUBMISSIONS = 'submissions',
}
