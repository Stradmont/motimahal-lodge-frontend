'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs: { label: string; href?: string }[];
  bgImage?: string;
}

export default function PageHero({
  title,
  subtitle,
  badge,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <div className="relative bg-[#FAF7F2] text-[#2D2B2A] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E6DFD5]">
      <div className="relative mx-auto max-w-7xl space-y-4">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 flex-wrap">
          <Link href="/" className="hover:text-[#1F3A2B] transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-4 w-4 text-stone-400 shrink-0" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#1F3A2B] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-stone-900 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Badge tag if provided */}
        {badge && (
          <span className="inline-block bg-[#1F3A2B] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded">
            {badge}
          </span>
        )}

        {/* Heading & Subtitle */}
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2D2B2A]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-stone-600 text-base sm:text-lg max-w-3xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
