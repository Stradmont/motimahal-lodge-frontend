import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-texture text-brand-charcoal px-4 py-12 font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl border border-brand-border shadow-xs">
        <span className="font-heading text-6xl font-extrabold text-brand-gold block">
          404
        </span>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-brand-charcoal">
            Page Not Found
          </h1>
          <p className="text-stone-600 text-xs leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-block bg-brand-green hover:bg-brand-green-dark text-white px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
