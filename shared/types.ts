// Base API response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// USER & AUTH
export type SubscriptionTier = 'free' | 'pro' | 'premium';
export interface User {
  id: string; // Should be the user's email for our DO keying strategy
  name: string;
  email: string;
  passwordHash: string;
  subscriptionTier: SubscriptionTier;
}
export interface UserUpdatePayload {
  name?: string;
}
export interface SubscriptionUpdatePayload {
  subscriptionTier: SubscriptionTier;
}
export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string; // In a real app, this would be a JWT
}
// DASHBOARD
export interface KpiCardData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
}
export interface RevenueDataPoint {
  month: string;
  revenue: number;
}
export interface UserAcquisitionDataPoint {
  source: string;
  users: number;
}
export interface DashboardData {
  kpis: KpiCardData[];
  revenueOverTime: RevenueDataPoint[];
  userAcquisition: UserAcquisitionDataPoint[];
}
// MEETING ANALYSIS
export interface MeetingAnalysisPayload {
  text: string;
}
export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
}
export interface MeetingAnalysisResult {
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
}
// PERFORMANCE ALERTS
export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
}
// DETAILED ANALYTICS
export interface DetailedAnalyticsData {
  mrr: number;
  activeUsers: number;
  newSubscriptions: number;
  conversionRate: number;
  mrrHistory: { month: string; mrr: number }[];
  acquisitionFunnel: { stage: string; count: number }[];
}
// BILLING
export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
}