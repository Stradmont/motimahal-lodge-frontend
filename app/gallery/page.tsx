'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyChooseSection from '@/components/WhyChooseSection';
import BookingModal from '@/components/BookingModal';
import { GALLERY_DATA } from '@/lib/data';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
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
        <section
          className="py-16 sm:py-24 border-b border-[#E6DFD5] relative text-[#2D2B2A]"
          style={{
            backgroundImage: "url('/backs.png')",
            backgroundRepeat: 'repeat',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Responsive Masonry-Style Grid Arrangement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {GALLERY_DATA.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={`bg-white rounded-lg border border-[#E6DFD5] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group relative ${item.aspect || 'aspect-16/10'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover Overlay with Expand Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white">
                    <div className="self-end bg-black/60 p-2.5 rounded-full backdrop-blur-xs shadow">
                      <Maximize2 className="h-5 w-5 text-white" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 block">
                        {item.category}
                      </span>
                      <h3 className="font-heading text-xl font-bold text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/90 line-clamp-1">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 3. WHY CHOOSE MOTIMAHAL SECTION */}
        <WhyChooseSection />

        {/* 4. BOOKING ENQUIRY CTA SECTION */}
        <section className="py-20 sm:py-24 bg-[#FAF7F2] text-[#2D2B2A] text-center border-t border-[#E6DFD5]">
          <div className="mx-auto max-w-4xl px-6 space-y-6">
            <span className="text-[#1F3A2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
              Plan Your Visit
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2D2B2A]">
              Experience Motimahal Lodge in Person
            </h2>
            <p className="text-stone-600 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed font-normal">
              Book your stay directly with our family for direct room rates and safari trip arrangements in Bharatpur.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="bg-[#1F3A2B] hover:bg-[#162B20] border border-[#2D4D3B] text-white font-semibold text-sm sm:text-base py-4 px-9 rounded-full transition-all cursor-pointer tracking-wider uppercase shadow-xs"
                style={{
                  backgroundImage: "linear-gradient(rgba(31, 58, 43, 0.88), rgba(31, 58, 43, 0.88)), url('/backs.png')",
                  backgroundRepeat: 'repeat',
                }}
              >
                Check Room Availability & Enquire
              </button>
            </div>
          </div>
        </section>

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
            <div className="text-center text-white space-y-1 bg-black/60 px-6 py-3 rounded-full border border-white/10 backdrop-blur-xs max-w-2xl">
              <span className="text-[11px] font-semibold text-[#A8BBA2] uppercase tracking-widest block">
                {activeItem.category} • ({lightboxIndex + 1} of {GALLERY_DATA.length})
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                {activeItem.title}
              </h3>
              <p className="text-xs text-stone-300 font-normal">
                {activeItem.caption}
              </p>
            </div>
          </div>

        </div>
      )}

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}
