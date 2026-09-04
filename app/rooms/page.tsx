'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyChooseSection from '@/components/WhyChooseSection';
import WhatToExpectSection from '@/components/WhatToExpectSection';
import { ROOMS_DATA } from '@/lib/data';
import { Check, Calendar, ArrowRight, ThermometerSun, ShowerHead, Wifi, Coffee } from 'lucide-react';
import CtaSection from '@/components/CtaSection';

export default function RoomsPage() {
  return (
    <div className="min-h-screen flex flex-col text-brand-charcoal bg-texture">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[45vh] min-h-[360px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1800')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xs" />

          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white drop-shadow-md leading-tight">
              Rooms & Accommodation
            </h1>
            <p className="text-stone-200 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
              Clean, spacious, and peaceful rooms in Bharatpur, Chitwan with modern amenities and warm Nepali hospitality.
            </p>
          </div>
        </section>

        {/* 2. ROOMS LISTING SECTION WITH backs.png BACKGROUND TEXTURE */}
        <section className="py-16 sm:py-24 bg-texture border-b border-brand-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-brand-green text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
                Stay With Us
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-brand-charcoal">
                Our Standard & Deluxe Rooms
              </h2>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
                Choose the perfect accommodation for your family, group, or solo travels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ROOMS_DATA.map((room) => {
                return (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Room Image with Badge */}
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                        {room.category}
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                            {room.name}
                          </h3>
                          <span className="text-xs text-stone-500 font-medium">
                            Up to {room.capacity}
                          </span>
                        </div>

                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {room.description}
                        </p>

                        {/* Key Amenities Badges */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {room.amenities.slice(0, 4).map((amenity, aIdx) => (
                            <span
                              key={aIdx}
                              className="bg-brand-surface text-stone-700 text-xs px-2.5 py-1 rounded border border-brand-border font-medium flex items-center gap-1.5"
                            >
                              <Check className="h-3 w-3 text-brand-green" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action CTAs */}
                      <div className="pt-3 flex items-center gap-3">
                        <Link
                          href={`/rooms/${room.slug}#enquiry-section`}
                          className="bg-brand-green hover:bg-brand-green-dark text-white text-sm font-medium px-5 py-2.5 rounded-md transition-all shadow-xs flex-1 text-center"
                        >
                          Book now
                        </Link>
                        <Link
                          href={`/rooms/${room.slug}`}
                          className="bg-brand-surface hover:bg-stone-200 text-brand-green border border-brand-border text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. WHY CHOOSE MOTIMAHAL SECTION */}
        <WhyChooseSection />
        {/* 4. WHAT TO EXPECT SECTION */}
        <WhatToExpectSection />

        {/* 5. FINAL BOOKING CTA SECTION */}
        <CtaSection
          title="Reserve your room directly with our family"
          description="Book directly with Motimahal Lodge for guaranteed nightly rates, airport pickup, and Chitwan safari assistance."
          buttonText="Check room availability & enquiry"
          bgTexture={true}
        />
      </main>

      <Footer />
    </div>
  );
}
