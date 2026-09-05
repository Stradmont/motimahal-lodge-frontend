'use client';

import React from 'react';
import { Mail, Phone, User, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InquiryCustomerHeaderProps {
  name: string;
  email: string;
  phone: string;
  date: string;
  badge?: React.ReactNode;
  categoryOrRoom?: string;
  isUrgent?: boolean;
  referenceId?: string;
}

export function InquiryCustomerHeader({
  name,
  email,
  phone,
  date,
  badge,
  categoryOrRoom,
  isUrgent,
  referenceId,
}: InquiryCustomerHeaderProps) {
  return (
    <div className="space-y-3 font-sans pb-4 border-b border-slate-200 dark:border-slate-800">
      {/* Header Top Row: Badges, Ref ID & Submission Time */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {badge}
          {categoryOrRoom && (
            <Badge variant="outline" className="text-xs font-normal border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300">
              {categoryOrRoom}
            </Badge>
          )}
          {isUrgent && (
            <Badge variant="destructive" className="text-[11px] px-2 py-0.5 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Urgent Inquiry
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          {referenceId && <span>Ref: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{referenceId}</strong></span>}
          <span>Submitted: {date}</span>
        </div>
      </div>

      {/* Guest Main Specs Bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
          <a
            href={`mailto:${email}`}
            className="text-emerald-700 dark:text-emerald-400 hover:underline font-mono text-xs"
          >
            {email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
          <a
            href={`tel:${phone}`}
            className="text-slate-700 dark:text-slate-300 hover:underline font-mono text-xs"
          >
            {phone}
          </a>
        </div>
      </div>
    </div>
  );
}
