'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';

export default function FacilitiesSection() {
  return (
    <section className="py-20 sm:py-28 border-b border-brand-border relative bg-texture">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-charcoal tracking-wider uppercase text-center lg:text-left">
          FACILITIES
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Bookmark Facility Items List */}
          <div className="lg:col-span-6 space-y-10">
            {/* Facility 1: Restaurant & Dining */}
            <div className="flex items-start gap-5">
              <Bookmark className="h-6 w-6 text-brand-green shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                  Restaurant & Dining
                </h3>
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                  Our on-site restaurant serves a delightful array of local and international cuisines. Savor the flavors of traditional Nepali dishes or indulge in familiar western delights. Our attentive staff caters to your dietary preferences and ensures a pleasant dining experience.
                </p>
              </div>
            </div>

            {/* Facility 2: Common Areas */}
            <div className="flex items-start gap-5">
              <Bookmark className="h-6 w-6 text-brand-green shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                  Common Areas
                </h3>
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                  Relax and unwind in our spacious common areas, where you can meet fellow travelers and share stories of your adventures. We provide a friendly atmosphere, encouraging a sense of community and camaraderie.
                </p>
              </div>
            </div>

            {/* Facility 3: Hot Showers */}
            <div className="flex items-start gap-5">
              <Bookmark className="h-6 w-6 text-brand-green shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                  Hot Showers
                </h3>
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                  After a day of safari or travel, rejuvenate with a hot shower, a true luxury for travelers.
                </p>
              </div>
            </div>

            {/* Facility 4: Free Wi-Fi */}
            <div className="flex items-start gap-5">
              <Bookmark className="h-6 w-6 text-brand-green shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                  Free Wi-Fi
                </h3>
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                  Stay connected with loved ones back home and share your incredible moments with them using our complimentary Wi-Fi service.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Stacked Lodge Facility Photos */}
          <div className="lg:col-span-6 space-y-6">
            {/* Lodge Exterior & Courtyard */}
            <div className="rounded-xl overflow-hidden border border-brand-border shadow-md hover:shadow-lg transition-all duration-300 relative group aspect-16/10 bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about/full-house-image.png"
                alt="Motimahal Lodge Main Building & Grounds"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <span className="text-white font-medium text-xs sm:text-sm drop-shadow-xs">
                  Motimahal Lodge Main Building & Grounds
                </span>
              </div>
            </div>

            {/* Narayani River Promenade & Surroundings */}
            <div className="rounded-xl overflow-hidden border border-brand-border shadow-md hover:shadow-lg transition-all duration-300 relative group aspect-16/10 bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gallery/narayani-river-gallery.jpg"
                alt="Narayani River Sunset Promenade"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <span className="text-white font-medium text-xs sm:text-sm drop-shadow-xs">
                  Narayani Riverfront Sunset Walkways
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
