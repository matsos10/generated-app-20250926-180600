import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { DashboardData, KpiCardData, ActionItem } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { ActionItemsTable } from '@/components/dashboard/ActionItemsTable';
const kpiIcons = {
  'Total Revenue': <DollarSign className="h-4 w-4 text-muted-foreground" />,
  'Subscriptions': <Users className="h-4 w-4 text-muted-foreground" />,
  'Sales': <CreditCard className="h-4 w-4 text-muted-foreground" />,
  'Churn Rate': <Activity className="h-4 w-4 text-muted-foreground" />,
};
const KpiCard = ({ data }: { data: KpiCardData }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
      {kpiIcons[data.title as keyof typeof kpiIcons]}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{data.value}</div>
      <p className="text-xs text-muted-foreground flex items-center">
        {data.changeType === 'increase' ? (
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={data.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
          {data.change}
        </span>
      </p>
    </CardContent>
  </Card>
);
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
export function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, itemsData] = await Promise.all([
          api<DashboardData>('/api/dashboard'),
          api<ActionItem[]>('/api/action-items'),
        ]);
        setDashboardData(dashData);
        setActionItems(itemsData);
      } catch (error) {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  if (!isAuthenticated) {
    return null; // or a loading spinner while redirecting
  }
  return (
    <AppLayout>
      <Toaster richColors />
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[126px]" />)}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardData?.kpis.map((kpi) => <KpiCard key={kpi.title} data={kpi} />)}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? <Skeleton className="h-[350px]" /> : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dashboardData?.revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}K`} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>User Acquisition</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[350px]" /> : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={dashboardData?.userAcquisition} dataKey="users" nameKey="source" cx="50%" cy="50%" outerRadius={120} label>
                      {dashboardData?.userAcquisition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Action Items</CardTitle>
            <CardDescription>A summary of tasks from recent meetings.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[400px]" /> : <ActionItemsTable data={actionItems} />}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}