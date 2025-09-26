import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ActionItem } from '@shared/types';
import { columns } from './ActionItemsTable.columns';
type SortDirection = 'asc' | 'desc';
type SortKey = keyof ActionItem;
export function ActionItemsTable({ data }: { data: ActionItem[] }) {
  const [filter, setFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<{ key: SortKey; direction: SortDirection }>({
    key: 'dueDate',
    direction: 'asc',
  });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 });
  const handleSort = (key: SortKey) => {
    setSorting((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };
  const filteredData = React.useMemo(() => {
    return data.filter((item) =>
      item.task.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sorting.key];
      const bValue = b[sorting.key];
      if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sorting]);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tasks..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.accessorKey)}>
                  {typeof column.header === 'string' ? (
                    column.header
                  ) : (
                    column.header({ toggleSort: handleSort })
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell({ row })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {pagination.pageIndex + 1} of {pageCount}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex - 1 }))}
            disabled={pagination.pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }))}
            disabled={pagination.pageIndex >= pageCount - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}