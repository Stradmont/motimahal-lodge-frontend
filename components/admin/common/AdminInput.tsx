import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AdminInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-50 font-sans shadow-2xs transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
AdminInput.displayName = 'AdminInput';

export { AdminInput, AdminInput as Input };
