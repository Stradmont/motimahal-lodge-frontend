'use client';

import React from 'react';
import Link from 'next/link';

export default function FoodMenuSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-brand-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-brand-green text-xs font-semibold uppercase tracking-wider block">
              Motimahal Tandoori & Restaurant
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-green leading-tight">
              Fresh Clay-Oven Grills & Authentic Nepalese Thali
            </h2>
            
            <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
              <p>
                Our kitchen marinates fresh chicken in mustard oil, yogurt, and ground spices before roasting over natural charcoal heat in traditional clay tandoors.
              </p>
              <p>
                We also prepare authentic local Thakali sets, fresh river fish, and garlic butter naan daily. Guests staying in our lodge can scan the Stradmont Order QR code in their room to order food directly to their door.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/food"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-green hover:text-brand-green-dark transition-colors border-b border-brand-green pb-0.5"
              >
                <span>View Full Menu & Pricing →</span>
              </Link>
            </div>
          </div>

          {/* Right Photography */}
          <div className="lg:col-span-6 rounded-lg overflow-hidden border border-brand-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?auto=format&fit=crop&q=80&w=1000"
              alt="Fresh Tandoori Chicken from Clay Oven"
              className="w-full h-80 sm:h-96 object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
