'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PublicGalleryService } from '@/lib/services/gallery.service';
import { GalleryCategory } from '@/lib/types/gallery';

export interface AboutSlide {
  id: string;
  title: string;
  image: string;
  caption: string;
}

const DEFAULT_FALLBACK_SLIDES: AboutSlide[] = [
  {
    id: 'lodge-main-building',
    title: 'Motimahal Lodge Main Building & Grounds',
    image: '/about/full-house-image.png',
    caption: 'Our main lodge building featuring clean AC guest rooms, gated parking, and quiet surroundings.',
  },
  {
    id: 'lodge-courtyard',
    title: 'Tranquil Courtyard & Garden Entrance',
    image: '/about/outside-image.png',
    caption: 'Peaceful green courtyard garden where guests relax after Chitwan wildlife safaris and enjoy morning tea.',
  },
  {
    id: 'narayani-river',
    title: 'Narayani Riverfront Sunset Promenade',
    image: '/gallery/narayani-river-gallery.jpg',
    caption: 'Stunning golden sunset views along the Narayani River, perfect for evening strolls just 5 minutes away.',
  },
  {
    id: 'deluxe-room',
    title: 'Clean, Spacious AC Guest Rooms',
    image: '/about/room1.PNG',
    caption: 'Restful air-conditioned bedrooms featuring 24/7 solar hot showers, fresh linens, and garden views.',
  },
  {
    id: 'host-family',
    title: '20+ Years of Dedicated Nepalese Hospitality',
    image: '/about/owner-image.png',
    caption: 'Our host family welcomes every guest with personal care, safari assistance, and authentic local warmth.',
  },
  {
    id: 'twin-room',
    title: 'Standard Twin & Single Bedroom',
    image: '/about/single-bed-room.PNG',
    caption: 'Clean, well-maintained twin bed room ideal for travel companions, solo travelers, and highway rest.',
  },
  {
    id: 'narayani-walkway',
    title: 'Narayani River Promenade & Riverwalk',
    image: '/gallery/narayani-river-break.jpg',
    caption: 'Gentle river breezes, scenic paths, and evening food stalls near Narayangadh, Bharatpur.',
  },
  {
    id: 'bedroom-setup',
    title: 'Comfortable Bedroom Amenities & Service',
    image: '/about/single-bed-image-1.PNG',
    caption: 'Daily housekeeping, continuous hot water, and silent air conditioning for peaceful rest.',
  },
];

export default function AboutCarousel() {
  const [slides, setSlides] = useState<AboutSlide[]>(DEFAULT_FALLBACK_SLIDES);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  const dragStartX = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dynamic gallery items from backend API filtered by 'home-about' category
  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        let res = await PublicGalleryService.getAll(GalleryCategory.HOME_ABOUT);
        if (!res.success || !res.data || res.data.length === 0) {
          // Fallback to GENERAL category gallery if home-about category has no items
          res = await PublicGalleryService.getAll(GalleryCategory.GENERAL);
        }

        if (isMounted && res.success && res.data && res.data.length > 0) {
          const dynamicSlides: AboutSlide[] = [];
          res.data.forEach((section) => {
            if (section.mediaItems && section.mediaItems.length > 0) {
              section.mediaItems.forEach((media, idx) => {
                if (media.url) {
                  dynamicSlides.push({
                    id: `${section.id}-${media.id || idx}`,
                    title: section.title,
                    image: media.url,
                    caption: section.description || section.title,
                  });
                }
              });
            }
          });

          if (dynamicSlides.length > 0) {
            setSlides(dynamicSlides);
            setDisplayIndex(1);
            setWithTransition(false);
          }
        }
      } catch (error) {
        console.error('Failed to load dynamic gallery for AboutCarousel:', error);
      }
    }
    loadGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalRealSlides = slides.length;
  const extendedSlides: AboutSlide[] =
    totalRealSlides > 0
      ? [slides[totalRealSlides - 1], ...slides, slides[0]]
      : [];

  const activeRealIndex =
    totalRealSlides > 0 ? (displayIndex - 1 + totalRealSlides) % totalRealSlides : 0;

  // Track window resize for responsive centering
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Card dimensions based on viewport width
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

  // Calculate track position to center the active card
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

  // Handle boundary jumps for infinite continuous loop
  const handleTransitionEnd = () => {
    if (displayIndex === 0) {
      setWithTransition(false);
      setDisplayIndex(totalRealSlides);
    } else if (displayIndex === extendedSlides.length - 1) {
      setWithTransition(false);
      setDisplayIndex(1);
    }
  };

  const goToSlide = (realIdx: number) => {
    setWithTransition(true);
    setDisplayIndex(realIdx + 1);
  };

  // Continuous auto-slide (pauses on hover/drag)
  useEffect(() => {
    if (isPlaying && !isHovered && !isDragging) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, isDragging, nextSlide]);

  // Pointer & Drag Handlers
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

  const currentSlide = slides[activeRealIndex] || slides[0];

  if (!currentSlide) return null;

  return (
    <div className="w-full relative overflow-hidden py-4 select-none">
      {/* Viewport Track Container spanning edge-to-edge */}
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
          {extendedSlides.map((slide, idx) => {
            const isActive = idx === displayIndex;

            return (
              <div
                key={`${slide.id}-${idx}`}
                className={`shrink-0 rounded-2xl overflow-hidden relative transition-all duration-700 ease-out border ${
                  isActive
                    ? 'scale-100 opacity-100 shadow-md border-brand-border z-20'
                    : 'scale-[0.92] opacity-55 shadow-xs border-transparent z-10'
                }`}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                }}
              >
                {/* Pure, Unvarnished Photography — No Gradients, No Overlays */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Simple, Functional Arrow Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-brand-charcoal shadow-md border border-brand-border flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-brand-charcoal shadow-md border border-brand-border flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Clean, Natural Caption & Navigation Below the Image */}
      <div className="max-w-3xl mx-auto px-6 mt-6 text-center space-y-3">
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal">
          {currentSlide.title}
        </h3>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
          {currentSlide.caption}
        </p>

        {/* Minimal Dot Indicators & Counter */}
        <div className="pt-2 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeRealIndex === idx
                    ? 'w-6 bg-brand-green'
                    : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          <span className="text-stone-400 font-mono text-xs">
            {String(activeRealIndex + 1).padStart(2, '0')} / {String(totalRealSlides).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
