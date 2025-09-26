import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { api } from '@/lib/api-client';
import type { PerformanceAlert } from '@shared/types';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
const alertIcons = {
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};
const alertBgColors = {
  warning: 'bg-yellow-500/10',
  success: 'bg-green-500/10',
  info: 'bg-blue-500/10',
};
export function Notifications() {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnread, setHasUnread] = useState(true);
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await api<PerformanceAlert[]>('/api/alerts');
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setHasUnread(false);
    }
  };
  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {hasUnread && <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">Recent performance alerts.</p>
        </div>
        <Separator />
        <div className="p-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="space-y-4 p-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className={cn("flex items-start gap-4 p-2 rounded-lg", alertBgColors[alert.type])}>
                <div className="mt-1">{alertIcons[alert.type]}</div>
                <div>
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground p-4">
              No new notifications.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}