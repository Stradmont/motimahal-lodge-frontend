'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors securely without leaking sensitive info to the browser
    console.error('Unhandled Application Error:', error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center font-bold text-xl">
          !
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Something went wrong
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            An unexpected error occurred. Please try refreshing the page or returning to the homepage.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
