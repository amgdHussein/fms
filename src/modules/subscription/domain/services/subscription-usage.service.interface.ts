import { Usage } from '../entities';

export interface ISubscriptionUsageService {
  getUsage(subscriptionId: string): Promise<Usage[]>;
  addUsage(usage: Partial<Usage>[], subscriptionId: string): Promise<Usage[]>;
  updateUsage(usage: Partial<Usage> & { id: string }, subscriptionId: string): Promise<Usage>;
}
