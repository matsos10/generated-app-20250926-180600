import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { DetailedAnalyticsData } from '@shared/types';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
const StatCard = ({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
);
export function AnalyticsPage() {
  const [data, setData] = useState<DetailedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const analyticsData = await api<DetailedAnalyticsData>('/api/analytics');
        setData(analyticsData);
      } catch (error) {
        toast.error('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">A deep dive into your business performance.</p>
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[126px]" />)}
          </div>
        ) : data && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Monthly Revenue" value={`$${data.mrr.toLocaleString()}`} change="+12.5% vs last month" icon={<DollarSign className="h-4 w-4" />} />
            <StatCard title="Active Users" value={data.activeUsers.toLocaleString()} change="+8.2% vs last month" icon={<Users className="h-4 w-4" />} />
            <StatCard title="New Subscriptions" value={data.newSubscriptions.toLocaleString()} change="+22% vs last month" icon={<ShoppingCart className="h-4 w-4" />} />
            <StatCard title="Conversion Rate" value={`${data.conversionRate}%`} change="+1.8% vs last month" icon={<TrendingUp className="h-4 w-4" />} />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Recurring Revenue (MRR)</CardTitle>
              <CardDescription>Revenue growth over the past 12 months.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data?.mrrHistory}>
                    <defs>
                      <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(value) => `$${(value as number / 1000)}k`} />
                    <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                    <Area type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMrr)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>User Acquisition Funnel</CardTitle>
              <CardDescription>From site visit to active subscription.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.acquisitionFunnel} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={12} />
                    <YAxis type="category" dataKey="stage" width={100} fontSize={12} />
                    <Tooltip formatter={(value) => (value as number).toLocaleString()} />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--primary))" background={{ fill: 'hsl(var(--muted))' }} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}