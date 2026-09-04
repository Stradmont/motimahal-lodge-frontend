'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Room } from '@/lib/data';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface RoomSpotlightGalleryProps {
  room: Room;
  allImages: string[];
}

export default function RoomSpotlightGallery({ room, allImages }: RoomSpotlightGalleryProps) {
  // Ensure we have slides to present
  const imagesList = allImages && allImages.length > 0 ? allImages : [room.image];
  const totalRealSlides = imagesList.length;

  // Build extended array for seamless continuous looping: [Clone Last, ...Real Images, Clone First]
  const extendedImages = [
    imagesList[totalRealSlides - 1],
    ...imagesList,
    imagesList[0],
  ];

  const [displayIndex, setDisplayIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const dragStartX = useRef<number>(0);

  const activeRealIndex = (displayIndex - 1 + totalRealSlides) % totalRealSlides;

  // Track viewport width for responsive card centering
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate card dimensions dynamically matching AboutCarousel styling
  let cardWidth = 720;
  let cardGap = 24;
  let cardHeight = 460;

  if (windowWidth < 640) {
    cardWidth = Math.min(windowWidth - 48, 340);
    cardGap = 16;
    cardHeight = 300;
  } else if (windowWidth < 1024) {
    cardWidth = 540;
    cardGap = 20;
    cardHeight = 400;
  } else if (windowWidth < 1400) {
    cardWidth = 680;
    cardGap = 24;
    cardHeight = 460;
  } else {
    cardWidth = 760;
    cardGap = 28;
    cardHeight = 500;
  }

  // Calculate track offset to keep the active card perfectly centered
  const centerOffset = (windowWidth - cardWidth) / 2;
  const trackTranslateX = centerOffset - displayIndex * (cardWidth + cardGap) + dragOffset;

  const nextSlide = useCallback(() => {
    setWithTransition(true);
    setDisplayIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setWithTransition(true);
    setDisplayIndex((prev) => prev - 1);
  }, []);

  // Continuous loop boundary resets
  const handleTransitionEnd = () => {
    if (displayIndex === 0) {
      setWithTransition(false);
      setDisplayIndex(totalRealSlides);
    } else if (displayIndex === extendedImages.length - 1) {
      setWithTransition(false);
      setDisplayIndex(1);
    }
  };

  const goToSlide = (realIdx: number) => {
    setWithTransition(true);
    setDisplayIndex(realIdx + 1);
  };

  // Pointer & Drag handlers
  const handlePointerDown = (clientX: number) => {
    dragStartX.current = clientX;
    setIsDragging(true);
    setWithTransition(false);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX.current;
    setDragOffset(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setWithTransition(true);

    const threshold = 50;
    if (dragOffset < -threshold) {
      nextSlide();
    } else if (dragOffset > threshold) {
      prevSlide();
    }
    setDragOffset(0);
  };

  return (
    <section
      className="py-12 sm:py-16 border-b border-[#E6DFD5] relative overflow-hidden select-none"
      style={{
        backgroundImage: "url('/backs-2.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="w-full relative space-y-6">
        {/* Full-width edge-to-edge carousel viewport */}
        <div
          className="w-full relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ height: `${cardHeight + 20}px` }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handlePointerUp();
          }}
          onMouseDown={(e) => handlePointerDown(e.clientX)}
          onMouseMove={(e) => handlePointerMove(e.clientX)}
          onMouseUp={handlePointerUp}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
          onTouchEnd={handlePointerUp}
        >
          {/* Sliding Track */}
          <div
            className={`flex items-center h-full ${
              withTransition ? 'transition-transform duration-700 ease-out' : 'transition-none'
            }`}
            style={{
              gap: `${cardGap}px`,
              transform: `translateX(${trackTranslateX}px)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedImages.map((imgUrl, idx) => {
              const isActive = idx === displayIndex;

              return (
                <div
                  key={`${imgUrl}-${idx}`}
                  onClick={() => {
                    if (isActive) {
                      setLightboxOpen(true);
                    } else {
                      setWithTransition(true);
                      setDisplayIndex(idx);
                    }
                  }}
                  className={`shrink-0 rounded-2xl overflow-hidden relative transition-all duration-700 ease-out border cursor-pointer ${
                    isActive
                      ? 'scale-100 opacity-100 shadow-xl border-[#E6DFD5] z-20'
                      : 'scale-[0.92] opacity-50 shadow-xs border-transparent z-10 hover:opacity-75'
                  }`}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                  }}
                >
                  {/* Pure Unvarnished Photography matching About Carousel */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${room.name} Photo`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {isActive && (
                    <div className="absolute top-4 right-4 bg-black/60 text-white text-sm font-semibold px-3.5 py-1.5 rounded backdrop-blur-xs">
                      {activeRealIndex + 1} / {totalRealSlides}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Navigation Chevron Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 hover:bg-white text-[#2D2B2A] shadow-md border border-[#E6DFD5] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 hover:bg-white text-[#2D2B2A] shadow-md border border-[#E6DFD5] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>

        {/* Action Button & Indicator Dots */}
        <div className="flex flex-col items-center gap-4 pt-2">
          {/* Centered FullScreen Button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="bg-white hover:bg-stone-50 text-[#2D2B2A] border border-[#2D2B2A] font-semibold text-sm sm:text-base px-7 py-3 rounded-full shadow-xs transition-all cursor-pointer inline-flex items-center gap-2.5"
          >
            <Maximize2 className="h-4.5 w-4.5 text-[#1F3A2B]" />
            <span>FullScreen</span>
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2">
            {imagesList.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => goToSlide(dotIdx)}
                className={`transition-all rounded-full cursor-pointer ${
                  activeRealIndex === dotIdx
                    ? 'w-7 h-2.5 bg-[#1F3A2B]'
                    : 'w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="flex items-center justify-between text-white border-b border-white/10 pb-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="font-heading text-xl sm:text-2xl font-bold">
                {room.name} — Photography Gallery
              </h4>
              <span className="text-sm text-white/70">
                Photo {activeRealIndex + 1} of {totalRealSlides}
              </span>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 text-white/80 hover:text-white transition-colors cursor-pointer bg-white/10 hover:bg-white/20 rounded-full"
              aria-label="Close Lightbox"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 z-10 p-3 text-white bg-black/50 hover:bg-black/80 rounded-full transition-transform active:scale-90 border border-white/20"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagesList[activeRealIndex]}
              alt={`${room.name} Photo ${activeRealIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded shadow-2xl transition-all duration-300"
            />

            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 z-10 p-3 text-white bg-black/50 hover:bg-black/80 rounded-full transition-transform active:scale-90 border border-white/20"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>

          <div
            className="flex items-center justify-center gap-3 overflow-x-auto py-2 border-t border-white/10 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {imagesList.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`relative w-20 h-14 rounded overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                  activeRealIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
