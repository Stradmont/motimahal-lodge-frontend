'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface AdminFilterBarProps {
  filterOptions: FilterOption[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
}

export default function AdminFilterBar({
  filterOptions,
  activeFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records...',
}: AdminFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt.key;
          return (
            <Button
              key={opt.key}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFilterChange(opt.key)}
              className="text-sm h-9 whitespace-nowrap"
            >
              {opt.label} {opt.count !== undefined && opt.count > 0 ? `(${opt.count})` : ''}
            </Button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8 h-9 text-sm bg-white dark:bg-zinc-950"
        />
      </div>
    </div>
  );
}
