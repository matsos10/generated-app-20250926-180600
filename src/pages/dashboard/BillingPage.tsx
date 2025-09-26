import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Invoice } from '@shared/types';
import { Download, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export function BillingPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await api<Invoice[]>('/api/billing/invoices');
        setInvoices(data);
      } catch (error) {
        toast.error('Failed to load billing history.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('billing_page.title')}</h1>
          <p className="text-muted-foreground">{t('billing_page.description')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('billing_page.current_plan')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold capitalize">{user?.subscriptionTier} Plan</p>
              <p className="text-muted-foreground">Your plan renews on the 1st of next month.</p>
              <Button variant="outline" className="mt-4" onClick={() => toast.info('Redirecting to manage subscription...')}>
                Manage Subscription
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('billing_page.payment_method')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{t('billing_page.card_ending_in')} 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4" onClick={() => toast.info('Opening payment settings...')}>
                Update Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('billing_page.billing_history')}</CardTitle>
            <CardDescription>View and download your past invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('billing_page.invoice_id')}</TableHead>
                  <TableHead>{t('billing_page.date')}</TableHead>
                  <TableHead>{t('billing_page.amount')}</TableHead>
                  <TableHead>{t('billing_page.status')}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'} className={invoice.status === 'Paid' ? 'bg-green-600' : ''}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => toast.success(`Downloading invoice ${invoice.id}...`)}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">{t('billing_page.download')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      {t('billing_page.no_invoices')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}