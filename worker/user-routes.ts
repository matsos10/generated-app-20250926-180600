import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { DashboardData, User, UserUpdatePayload, SubscriptionUpdatePayload, MeetingAnalysisPayload, MeetingAnalysisResult, ActionItem, PerformanceAlert, DetailedAnalyticsData, Invoice } from "@shared/types";
// A simple hashing function for the mock auth. In a real app, use a robust library like bcrypt.
const hashPassword = async (password: string) => {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- AUTH ROUTES ---
  app.post('/api/auth/signup', async (c) => {
    const { name, email, password } = await c.req.json<{ name?: string, email?: string, password?: string }>();
    if (!isStr(name) || !isStr(email) || !isStr(password)) {
      return bad(c, 'Name, email, and password are required.');
    }
    const userEntity = new UserEntity(c.env, email);
    if (await userEntity.exists()) {
      return bad(c, 'A user with this email already exists.');
    }
    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: email, // Use email as the ID for the DO key
      name,
      email,
      passwordHash,
      subscriptionTier: 'free',
    };
    await UserEntity.create(c.env, newUser);
    const { passwordHash: _, ...userResponse } = newUser;
    return ok(c, {
      user: userResponse,
      token: `mock-token-for-${newUser.id}`
    });
  });
  app.post('/api/auth/login', async (c) => {
    const { email, password } = await c.req.json<{ email?: string, password?: string }>();
    if (!isStr(email) || !isStr(password)) {
      return bad(c, 'Email and password are required.');
    }
    const userEntity = new UserEntity(c.env, email);
    if (!await userEntity.exists()) {
      return notFound(c, 'Invalid credentials.');
    }
    const user = await userEntity.getState();
    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return bad(c, 'Invalid credentials.');
    }
    const { passwordHash: _, ...userResponse } = user;
    return ok(c, {
      user: userResponse,
      token: `mock-token-for-${user.id}`
    });
  });
  // --- USER & SUBSCRIPTION MANAGEMENT ---
  app.patch('/api/users/me', async (c) => {
    const { email } = await c.req.json<UserUpdatePayload & { email: string }>();
    if (!isStr(email)) return bad(c, 'User identifier missing.');
    const payload = await c.req.json<UserUpdatePayload>();
    const userEntity = new UserEntity(c.env, email);
    if (!await userEntity.exists()) return notFound(c, 'User not found.');
    await userEntity.patch({ name: payload.name });
    const updatedUser = await userEntity.getState();
    const { passwordHash: _, ...userResponse } = updatedUser;
    return ok(c, userResponse);
  });
  app.patch('/api/users/me/subscription', async (c) => {
    const { email, subscriptionTier } = await c.req.json<SubscriptionUpdatePayload & { email: string }>();
    if (!isStr(email) || !isStr(subscriptionTier)) return bad(c, 'User identifier and subscription tier required.');
    const userEntity = new UserEntity(c.env, email);
    if (!await userEntity.exists()) return notFound(c, 'User not found.');
    await userEntity.patch({ subscriptionTier });
    const updatedUser = await userEntity.getState();
    const { passwordHash: _, ...userResponse } = updatedUser;
    return ok(c, userResponse);
  });
  // --- DASHBOARD DATA ---
  app.get('/api/dashboard', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const mockDashboardData: DashboardData = {
      kpis: [
        { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', changeType: 'increase', description: 'Monthly recurring revenue' },
        { title: 'Subscriptions', value: '+2350', change: '+180.1% from last month', changeType: 'increase', description: 'Active subscribers' },
        { title: 'Sales', value: '+12,234', change: '+19% from last month', changeType: 'increase', description: 'New sales this month' },
        { title: 'Churn Rate', value: '2.1%', change: '-1.2% from last month', changeType: 'decrease', description: 'Monthly customer churn' },
      ],
      revenueOverTime: [
        { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 }, { month: 'Mar', revenue: 5000 },
        { month: 'Apr', revenue: 4500 }, { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 5500 },
        { month: 'Jul', revenue: 7000 }, { month: 'Aug', revenue: 6500 }, { month: 'Sep', revenue: 7500 },
        { month: 'Oct', revenue: 8000 }, { month: 'Nov', revenue: 9000 }, { month: 'Dec', revenue: 11000 },
      ],
      userAcquisition: [
        { source: 'Organic Search', users: 350 }, { source: 'Direct', users: 300 },
        { source: 'Referral', users: 200 }, { source: 'Social Media', users: 278 },
        { source: 'Paid Ads', users: 189 },
      ],
    };
    return ok(c, mockDashboardData);
  });
  // --- AI & DATA FEATURES ---
  app.post('/api/ai/analyze-meeting', async (c) => {
    const { text } = await c.req.json<MeetingAnalysisPayload>();
    if (!isStr(text)) return bad(c, 'Meeting text is required.');
    await new Promise(res => setTimeout(res, 1500));
    const mockResult: MeetingAnalysisResult = {
      summary: "The Q3 planning meeting focused on finalizing the marketing budget and setting new sales targets. The team agreed to increase ad spend by 15% and aims for a 20% growth in new customer acquisition.",
      keyDecisions: [
        "Increase Q3 marketing ad spend by 15%.",
        "Set a new sales target of 20% growth for new customer acquisition.",
        "Launch the 'Project Phoenix' campaign by August 1st."
      ],
      actionItems: [
        { id: 'ai-1', task: "Draft the revised Q3 marketing budget", assignee: "Alice", dueDate: "2024-07-15", status: 'To Do' },
        { id: 'ai-2', task: "Finalize the creative assets for 'Project Phoenix'", assignee: "Bob", dueDate: "2024-07-20", status: 'In Progress' },
        { id: 'ai-3', task: "Present the new sales targets to the executive team", assignee: "Charlie", dueDate: "2024-07-12", status: 'Done' }
      ]
    };
    return ok(c, mockResult);
  });
  app.get('/api/action-items', async (c) => {
    const mockActionItems: ActionItem[] = [
      { id: 'ai-1', task: "Draft the revised Q3 marketing budget", assignee: "Alice", dueDate: "2024-07-15", status: 'To Do' },
      { id: 'ai-2', task: "Finalize the creative assets for 'Project Phoenix'", assignee: "Bob", dueDate: "2024-07-20", status: 'In Progress' },
      { id: 'ai-3', task: "Present the new sales targets to the executive team", assignee: "Charlie", dueDate: "2024-07-12", status: 'Done' },
      { id: 'ai-4', task: "Onboard the new marketing intern", assignee: "Alice", dueDate: "2024-07-18", status: 'To Do' },
      { id: 'ai-5', task: "Analyze Q2 performance data", assignee: "David", dueDate: "2024-07-25", status: 'In Progress' },
    ];
    return ok(c, mockActionItems);
  });
  // --- ALERTS & ANALYTICS ---
  app.get('/api/alerts', async (c) => {
    const mockAlerts: PerformanceAlert[] = [
      { id: 'alert-1', type: 'warning', title: 'Churn Rate Spike', description: 'Monthly churn rate increased by 5% this week.' },
      { id: 'alert-2', type: 'success', title: 'MRR Goal Achieved', description: 'You have surpassed your monthly revenue goal by 10%.' },
      { id: 'alert-3', type: 'info', title: 'New Feature Usage', description: 'Adoption of the new AI analysis tool is at 25%.' },
    ];
    return ok(c, mockAlerts);
  });
  app.get('/api/analytics', async (c) => {
    const mockAnalytics: DetailedAnalyticsData = {
      mrr: 45231,
      activeUsers: 2350,
      newSubscriptions: 182,
      conversionRate: 4.2,
      mrrHistory: [
        { month: 'Jan', mrr: 28000 }, { month: 'Feb', mrr: 31000 }, { month: 'Mar', mrr: 30000 },
        { month: 'Apr', mrr: 33000 }, { month: 'May', mrr: 35000 }, { month: 'Jun', mrr: 38000 },
        { month: 'Jul', mrr: 41000 }, { month: 'Aug', mrr: 45231 },
      ],
      acquisitionFunnel: [
        { stage: 'Site Visits', count: 15230 },
        { stage: 'Trial Signups', count: 1280 },
        { stage: 'Subscriptions', count: 450 },
        { stage: 'Active Users', count: 2350 },
      ],
    };
    return ok(c, mockAnalytics);
  });
  // --- BILLING ---
  app.get('/api/billing/invoices', async (c) => {
    const mockInvoices: Invoice[] = [
      { id: 'INV-2024-005', date: '2024-08-01', amount: '$99.00', status: 'Paid' },
      { id: 'INV-2024-004', date: '2024-07-01', amount: '$99.00', status: 'Paid' },
      { id: 'INV-2024-003', date: '2024-06-01', amount: '$99.00', status: 'Paid' },
      { id: 'INV-2024-002', date: '2024-05-01', amount: '$49.00', status: 'Paid' },
      { id: 'INV-2024-001', date: '2024-04-01', amount: '$49.00', status: 'Paid' },
    ];
    return ok(c, mockInvoices);
  });
}