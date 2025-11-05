export type BillingCycle = 'monthly' | 'yearly' | 'weekly';

export interface Subscription {
  id: string;
  serviceName: string;
  cost: number;
  billingDate: number; // 1-31 (月の何日に課金されるか)
  billingCycle: BillingCycle;
  nextBillingDate: string; // ISO date string
  category?: string;
  memo?: string;
  createdAt: string; // ISO date string
}
