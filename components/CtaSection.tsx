import React from 'react';
import Link from 'next/link';

interface CtaSectionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  bgTexture?: boolean;
  className?: string;
}

export default function CtaSection({
  subtitle,
  title = 'Planning Your Visit to Chitwan?',
  description = 'Tell us your stay dates or questions and our family front desk will assist you with direct room rates.',
  buttonText = 'Check Availability & Contact Us',
  buttonHref = '/contact',
  bgTexture = true,
  className = '',
}: CtaSectionProps) {
  return (
    <section
      className={`py-20 sm:py-28 text-brand-charcoal text-center border-t border-brand-border relative overflow-hidden ${
        bgTexture ? 'bg-texture' : 'bg-brand-surface'
      } ${className}`}
    >
      <div className="mx-auto max-w-4xl px-6 space-y-6">
        {subtitle && (
          <span className="text-brand-green text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
            {subtitle}
          </span>
        )}

        <h2 className="font-heading text-3xl sm:text-5xl font-bold text-brand-charcoal">
          {title}
        </h2>

        <p className="text-stone-600 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="pt-2">
          <Link
            href={buttonHref}
            className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-green-dark border border-footer-border text-white font-semibold text-sm sm:text-base py-4 px-9 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <span>{buttonText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
