'use client';

import React from 'react';

interface InquiryMessageViewerProps {
  title?: string;
  message: string;
  specialRequests?: string;
}

export function InquiryMessageViewer({
  title = 'Customer message',
  message,
  specialRequests,
}: InquiryMessageViewerProps) {
  return (
    <div className="space-y-2 font-sans">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h4>
      <div className="p-4 rounded-md border-l-4 border-emerald-600 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
        {message}
      </div>

      {specialRequests && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <h5 className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Special Requests / Guest Notes
          </h5>
          <p className="text-sm text-slate-700 dark:text-slate-300 italic bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded border border-amber-200/50 dark:border-amber-900/40">
            "{specialRequests}"
          </p>
        </div>
      )}
    </div>
  );
}
