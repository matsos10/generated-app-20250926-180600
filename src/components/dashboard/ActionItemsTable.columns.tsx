import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ActionItem } from '@shared/types';
import { ArrowUpDown } from 'lucide-react';
const statusVariantMap: { [key in ActionItem['status']]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
  'To Do': 'secondary',
  'In Progress': 'default',
  'Done': 'outline',
};
export type Column<T> = {
  accessorKey: keyof T;
  header: string | (({ toggleSort }: { toggleSort: (key: keyof T) => void }) => JSX.Element);
  cell: ({ row }: { row: T }) => JSX.Element;
};
export const columns: Column<ActionItem>[] = [
  {
    accessorKey: 'task',
    header: 'Task',
    cell: ({ row }) => <div className="capitalize font-medium">{row.task}</div>,
  },
  {
    accessorKey: 'assignee',
    header: ({ toggleSort }) => (
      <Button
        variant="ghost"
        onClick={() => toggleSort('assignee')}
        className="-ml-4"
      >
        Assignee
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.assignee}</div>,
  },
  {
    accessorKey: 'dueDate',
    header: ({ toggleSort }) => (
        <Button
          variant="ghost"
          onClick={() => toggleSort('dueDate')}
          className="-ml-4"
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => <div>{row.dueDate}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.status;
      return (
        <Badge variant={statusVariantMap[status]} className={cn(status === 'In Progress' && 'bg-primary text-primary-foreground')}>
          {status}
        </Badge>
      );
    },
  },
];