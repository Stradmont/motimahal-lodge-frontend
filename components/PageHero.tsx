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
    <div className="relative bg-[#FAF7F2] text-[#2D2B2A] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E6DFD5]">
      <div className="relative mx-auto max-w-7xl space-y-3">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 flex-wrap">
          <Link href="/" className="hover:text-[#1F3A2B] transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
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
          <span className="inline-block bg-[#1F3A2B] text-white text-xs font-medium px-2.5 py-0.5 rounded">
            {badge}
          </span>
        )}

        {/* Heading & Subtitle */}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D2B2A]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

