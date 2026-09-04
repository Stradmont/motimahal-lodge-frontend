import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
