'use client';

import React from 'react';
import Link from 'next/link';
import { TESTIMONIALS_DATA } from '@/lib/data';

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DFD5]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#1F3A2B] text-xs font-semibold uppercase tracking-wider block">
            Guest Reflections
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F3A2B]">
            Stories from Our Guests
          </h2>
        </div>

        {/* Clean Editorial Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((review) => (
            <div key={review.id} className="space-y-4 bg-white p-6 rounded-lg border border-[#E6DFD5]">
              <p className="text-stone-700 text-xs sm:text-sm italic leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="pt-3 border-t border-[#E6DFD5] text-xs">
                <span className="font-bold text-[#1F3A2B] block">{review.name}</span>
                <span className="text-stone-500 text-[11px]">{review.location}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3A2B] hover:text-[#162B20] transition-colors border-b border-[#1F3A2B] pb-0.5"
          >
            <span>Read More Guest Reviews →</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
