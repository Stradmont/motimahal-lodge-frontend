'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface AdminColumn<T> {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface AdminDataTableProps<T> {
  columns: AdminColumn<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  onRowClick?: (item: T, index: number) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  className?: string;
  tableClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  footer?: React.ReactNode;
}

export function AdminDataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  loadingMessage = 'Loading records...',
  emptyMessage = 'No records found matching criteria.',
  className,
  tableClassName,
  rowClassName,
  footer,
}: AdminDataTableProps<T>) {
  return (
    <div
      className={cn(
        'w-full border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 overflow-hidden shadow-xs font-sans',
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <Table className={cn('w-full text-left border-collapse text-sm', tableClassName)}>
          <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    'text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 py-3 px-4 select-none',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center text-slate-500 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    <span className="text-xs font-medium">{loadingMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center text-slate-500 text-sm">
                  <div className="py-6 text-xs text-slate-500 font-medium">{emptyMessage}</div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => {
                const key = keyExtractor(item, index);
                const extraRowClass =
                  typeof rowClassName === 'function' ? rowClassName(item, index) : rowClassName;

                return (
                  <TableRow
                    key={key}
                    onClick={() => onRowClick && onRowClick(item, index)}
                    className={cn(
                      'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/50',
                      onRowClick && 'cursor-pointer',
                      extraRowClass
                    )}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          'py-3.5 px-4 text-sm text-slate-700 dark:text-slate-300 align-middle',
                          col.align === 'right' && 'text-right',
                          col.align === 'center' && 'text-center',
                          col.className
                        )}
                      >
                        {col.render ? col.render(item, index) : (item as any)[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {footer && (
        <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}

export default AdminDataTable;
