'use client';

import React from 'react';

export default function AmenitiesSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DFD5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-[#1F3A2B] text-xs font-semibold uppercase tracking-wider block mb-1">
            Lodge Comfort & Atmosphere
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F3A2B]">
            What to Expect During Your Stay
          </h2>
          <p className="text-stone-600 text-sm mt-2 leading-relaxed">
            We focus on providing simple, reliable comforts so you can rest deeply after travel or safari excursions.
          </p>
        </div>

        {/* Feature 1: Hot Showers & Power Backup (Image + Text) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 rounded-lg overflow-hidden border border-[#E6DFD5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000"
              alt="Clean AC Room & Bedding"
              className="w-full h-72 sm:h-88 object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-heading text-2xl font-bold text-[#1F3A2B]">
              Clean AC Rooms & 24/7 Hot Water
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Every room is equipped with individual split air conditioning, clean high-thread bedding, and attached bathrooms with continuous solar-electric hot water. Power backup generators ensure uninterrupted electricity.
            </p>
          </div>
        </div>

        {/* Feature 2: Narayani River & Garden Relaxation (Text + Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 lg:order-2 rounded-lg overflow-hidden border border-[#E6DFD5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000"
              alt="Narayani River Breeze"
              className="w-full h-72 sm:h-88 object-cover"
            />
          </div>
          <div className="lg:col-span-6 lg:order-1 space-y-4">
            <h3 className="font-heading text-2xl font-bold text-[#1F3A2B]">
              Narayani River Breeze & Outdoor Garden
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Located just 5 minutes from the Narayani River, our lodge grounds feature a peaceful garden courtyard where guests enjoy morning tea, evening breeze, and quiet conversations under the stars.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
