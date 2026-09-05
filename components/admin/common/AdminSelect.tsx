'use client';

import React from 'react';
import { ConfigProvider, Select, SelectProps } from 'antd';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminSelectProps extends SelectProps {
  className?: string;
  popupClassName?: string;
}

export function AdminSelect({ className, popupClassName, ...props }: AdminSelectProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#64748b', // slate-500 subtle primary accent
          colorBorder: '#cbd5e1', // slate-300
          borderRadius: 6, // 6px rounded-md
          fontSize: 12,
          fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif',
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorText: '#0f172a',
          colorTextPlaceholder: '#94a3b8',
          controlHeight: 36, // 36px (h-9)
          boxShadowSecondary: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        },
        components: {
          Select: {
            optionSelectedBg: '#f1f5f9', // slate-100
            optionActiveBg: '#f8fafc', // slate-50
            optionSelectedColor: '#0f172a',
            optionPadding: '6px 12px',
            activeBorderColor: '#94a3b8', // slate-400
            hoverBorderColor: '#94a3b8', // slate-400
            colorBgContainer: '#ffffff',
          },
        },
      }}
    >
      <Select
        suffixIcon={<ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />}
        className={cn(
          'w-full font-sans text-xs [&_.ant-select-selector]:!border-slate-300 [&_.ant-select-selector]:dark:!border-slate-700 [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:dark:!bg-slate-950 [&_.ant-select-selection-item]:!text-slate-800 [&_.ant-select-selection-item]:dark:!text-slate-200 [&_.ant-select-selection-item]:!font-medium [&_.ant-select-selector]:!rounded-md [&_.ant-select-selector]:!shadow-2xs [&_.ant-select-selector]:!transition-colors [&_.ant-select-selector]:!outline-none [&_.ant-select-focused_.ant-select-selector]:!border-slate-400 [&_.ant-select-focused_.ant-select-selector]:!shadow-2xs',
          className
        )}
        popupClassName={cn(
          'admin-select-popup font-sans [&_.ant-select-dropdown]:!bg-white [&_.ant-select-dropdown]:dark:!bg-slate-950 [&_.ant-select-dropdown]:!border [&_.ant-select-dropdown]:!border-slate-200 [&_.ant-select-dropdown]:dark:!border-slate-800 [&_.ant-select-dropdown]:!shadow-md [&_.ant-select-dropdown]:!p-1 [&_.ant-select-item-option-selected]:!bg-slate-100 [&_.ant-select-item-option-selected]:dark:!bg-slate-800 [&_.ant-select-item-option-selected]:!text-slate-900 [&_.ant-select-item-option-selected]:dark:!text-slate-100 [&_.ant-select-item-option-selected]:!font-semibold [&_.ant-select-item-option-active]:!bg-slate-50 [&_.ant-select-item-option-active]:dark:!bg-slate-900 [&_.ant-select-item-option-active]:!text-slate-900 [&_.ant-select-item-option-active]:dark:!text-slate-100',
          popupClassName
        )}
        {...props}
      />
    </ConfigProvider>
  );
}

export { AdminSelect as Select };

