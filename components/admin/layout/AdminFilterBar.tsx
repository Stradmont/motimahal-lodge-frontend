'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { AdminSelect as Select } from '@/components/admin/common/AdminSelect';
import { AdminInput as Input } from '@/components/admin/common/AdminInput';

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
  filterLabel?: string;
}

export default function AdminFilterBar({
  filterOptions,
  activeFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterLabel = 'Filter Status:',
}: AdminFilterBarProps) {
  const options = filterOptions.map((opt) => ({
    value: opt.key,
    label: (
      <div className="flex items-center justify-between gap-3 text-xs">
        <span>{opt.label}</span>
        {opt.count !== undefined && opt.count > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
            {opt.count}
          </span>
        )}
      </div>
    ),
  }));

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 font-sans">
      {/* Combobox Dropdown using Ant Design Select */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 shrink-0">
          {filterLabel}
        </span>
        <Select
          value={activeFilter}
          onChange={(val) => onFilterChange(val)}
          options={options}
          className="w-full sm:w-56 text-xs"
          size="middle"
          popupMatchSelectWidth={false}
        />
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8 h-9 text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-md"
        />
      </div>
    </div>
  );
}

