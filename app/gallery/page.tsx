'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyChooseSection from '@/components/WhyChooseSection';
import CtaSection from '@/components/CtaSection';
import { GALLERY_DATA } from '@/lib/data';
import { Maximize2, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeItem = lightboxIndex !== null ? GALLERY_DATA[lightboxIndex] : null;

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? GALLERY_DATA.length - 1 : lightboxIndex - 1);
  }, [lightboxIndex]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === GALLERY_DATA.length - 1 ? 0 : lightboxIndex + 1);
  }, [lightboxIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <div className="min-h-screen flex flex-col text-brand-charcoal bg-texture">
      <Navbar />

      <main className="flex-1">

        {/* 1. HERO SECTION WITH NARAYANI RIVER BACKGROUND IMAGE */}
        <section className="relative w-full h-[60vh] min-h-[440px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/narayani-river-gallery.jpg')",
            }}
          />
          {/* Subtle Dark Overlay */}
          <div className="absolute inset-0 z-10 bg-black/45" />

          {/* Centered Hero Content */}
          <div className="relative z-20 mx-auto max-w-5xl px-6 text-center text-white space-y-4">
            <span className="text-white/95 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] block">
              Moments from Motimahal
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              GALLERY
            </h1>
          </div>
        </section>

        {/* 2. CLEAN GALLERY GRID SECTION WITH backs.png BACKGROUND TEXTURE */}
        <section className="py-16 sm:py-24 border-b border-brand-border relative text-brand-charcoal bg-texture">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Uniform 3-Column Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {GALLERY_DATA.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="bg-white rounded-lg border border-brand-border overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 cursor-pointer group relative aspect-4/3 w-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                  />

                  {/* Soft Light Overlay Container on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none motion-reduce:transition-none">

                    {/* Centered Expand Icon Button */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="p-3 rounded-full bg-black/45 text-white border border-white/20 shadow-sm scale-95 group-hover:scale-100 transition-transform duration-300 ease-out backdrop-blur-xs motion-reduce:transition-none">
                        <Maximize2 className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Soft Natural Bottom Gradient for Readability */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end space-y-0.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/90 block">
                        {item.category}
                      </span>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-white leading-snug line-clamp-1">
                        {item.title}
                      </h3>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* 4. BOOKING ENQUIRY CTA SECTION */}
        <CtaSection
          subtitle="Plan Your Visit"
          title="Experience Motimahal Lodge in Person"
          description="Book your stay directly with our family for direct room rates and safari trip arrangements in Bharatpur."
          buttonText="Check Room Availability & Enquire"
          buttonHref="/enquiry"
          bgTexture={false}
        />
      </main>

      <Footer />

      {/* 5. FULLSCREEN LIGHTBOX MODAL */}
      {activeItem && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">

          {/* Backdrop Click to Close */}
          <div
            className="absolute inset-0"
            onClick={() => setLightboxIndex(null)}
            aria-hidden="true"
          />

          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-20 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Main Lightbox Content Box */}
          <div className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative overflow-hidden rounded-lg shadow-2xl border border-white/10 max-h-[75vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto rounded"
              />
            </div>

            {/* Caption & Counter Bar */}
            <div className="text-center text-white space-y-1.5 bg-black/80 px-6 sm:px-8 py-3.5 rounded-2xl border border-white/15 backdrop-blur-md max-w-2xl shadow-xl">
              <span className="text-[11px] font-semibold text-white/90 uppercase tracking-widest block">
                {activeItem.category} • ({lightboxIndex + 1} of {GALLERY_DATA.length})
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold !text-white leading-snug">
                {activeItem.title}
              </h3>
              <p className="text-xs sm:text-sm !text-stone-200 font-normal leading-relaxed">
                {activeItem.caption}
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
