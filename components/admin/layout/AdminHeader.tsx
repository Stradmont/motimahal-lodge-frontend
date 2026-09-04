'use client';

import React from 'react';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  onOpenMobileSidebar,
  title,
  subtitle,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileSidebar}
          className="lg:hidden text-zinc-600 dark:text-zinc-300"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </Button>

        <div>
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
            {title || 'Dashboard'}
          </h1>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-56">
          <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search CMS..."
            className="pl-8 h-8 text-xs bg-zinc-50 dark:bg-zinc-900"
          />
        </div>

        <div className="flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-7 h-7 rounded-sm bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="hidden sm:block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Admin Manager
          </span>
        </div>
      </div>
    </header>
  );
}
