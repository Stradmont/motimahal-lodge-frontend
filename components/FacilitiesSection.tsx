'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Maximize2, X } from 'lucide-react';

const FACILITIES_IMAGES = [
  {
    id: 'full-house',
    src: '/about/full-house-image.png',
    title: 'Motimahal Lodge Main Building & Grounds',
  },
  {
    id: 'narayani-river',
    src: '/gallery/narayani-river-gallery.jpg',
    title: 'Narayani Riverfront Sunset Walkways',
  },
];

export default function FacilitiesSection() {
  const [activeImage, setActiveImage] = useState<{ src: string; title: string } | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveImage(null);
    }
  }, []);

  useEffect(() => {
    if (activeImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeImage, handleKeyDown]);

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

          {/* Right Column: Stacked Lodge Facility Photos with Hover Fullscreen Option */}
          <div className="lg:col-span-6 space-y-6">
            {FACILITIES_IMAGES.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveImage(img)}
                className="rounded-xl overflow-hidden border border-brand-border shadow-md hover:shadow-xl transition-all duration-300 relative group aspect-16/10 bg-stone-100 cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Fullscreen Overlay Icon Button */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="p-3.5 rounded-full bg-black/60 text-white border border-white/30 backdrop-blur-xs transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <Maximize2 className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Bottom Caption Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/75 via-black/35 to-transparent flex items-center justify-between">
                  <span className="text-white font-medium text-xs sm:text-sm drop-shadow-xs">
                    {img.title}
                  </span>
                  <span className="text-[11px] text-stone-300 font-semibold uppercase tracking-wider hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to view full screen
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setActiveImage(null)}
            aria-hidden="true"
          />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-lg"
            aria-label="Close fullscreen view"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Lightbox Content Container */}
          <div className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4 pointer-events-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.src}
              alt={activeImage.title}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg border border-stone-800 shadow-2xl"
            />
            <p className="text-white font-heading text-lg sm:text-xl font-semibold text-center drop-shadow-md">
              {activeImage.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
