'use client';

import React from 'react';
import AboutCarousel from '@/components/AboutCarousel';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 sm:py-28 border-b border-brand-border relative text-brand-charcoal overflow-hidden bg-texture scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Narrative Text Container (Aligned to Global Container Grid) */}
      <div className="mx-auto max-w-5xl px-6 text-center space-y-6 mb-14 sm:mb-18">
        <span className="text-brand-green text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
          About Us
        </span>

        <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-charcoal leading-tight">
          Experience the Heart of Chitwan
        </h2>

        <div className="space-y-5 text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal max-w-4xl mx-auto">
          <p>
            Welcome to Motimahal Lodge and Restaurant, a family-owned establishment located in Bharatpur-10, Chitwan. Established three decades ago by our family, our lodge stands as a testament to our unwavering passion for hospitality, fresh local food, and quiet rest.
          </p>
          <p>
            Located just 5 minutes from the Narayani Riverfront promenade and 30 minutes drive from Chitwan National Park, guests enjoy easy access to river sunsets and wildlife safaris.
          </p>
          <p>
            At night, gather around our outdoor garden or restaurant tables to enjoy fresh tandoori grills prepared in our charcoal clay oven, continuous hot showers, and warm conversation with our family hosts.
          </p>
        </div>
      </div>

      {/* Full Viewport Width (Edge-to-Edge) Interactive Image Carousel */}
      <div className="w-full">
        <AboutCarousel />
      </div>
    </section>
  );
}
