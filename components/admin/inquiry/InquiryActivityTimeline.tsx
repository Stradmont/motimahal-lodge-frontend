'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { ContactActivityLog } from '@/lib/types/inquiry';

interface InquiryActivityTimelineProps {
  history?: ContactActivityLog[];
}

export function InquiryActivityTimeline({ history = [] }: InquiryActivityTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!history || history.length === 0) {
    return (
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Activity history
        </h4>
        <p className="text-xs text-slate-500 mt-1">No previous activity recorded.</p>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Activity history ({history.length})
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
        >
          {isExpanded ? (
            <>
              Hide details <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show timeline <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {history.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex items-start gap-3 text-xs pl-2 relative border-l-2 border-slate-200 dark:border-slate-800 ml-1.5 py-0.5"
            >
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-tight">
                  {item.action}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {item.timestamp} {item.author ? `• ${item.author}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
