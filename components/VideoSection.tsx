'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '@/components/SocialIcons';

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  instagramUrl: string;
}

const INSTAGRAM_REELS: VideoItem[] = [
  {
    id: 'DcyNwQJT_4R',
    title: '20 Years of Trusted Hospitality & New Lodge Facilities',
    thumbnail: '/gallery/reel-dcy.jpg',
    videoUrl: 'https://www.instagram.com/reel/DcyNwQJT_4R/embed/',
    instagramUrl: 'https://www.instagram.com/reel/DcyNwQJT_4R/',
  },
  {
    id: 'DbDrRUGv5CM',
    title: 'Looking for a Place to Stay in Chitwan? Motimahal Lodge',
    thumbnail: '/about/outside-image.png',
    videoUrl: 'https://www.instagram.com/reel/DbDrRUGv5CM/embed/',
    instagramUrl: 'https://www.instagram.com/reel/DbDrRUGv5CM/',
  },
  {
    id: 'DbVV6NTPOj8',
    title: 'Your Happy & Comfy Space to Stay at Chitwan',
    thumbnail: '/about/room1.PNG',
    videoUrl: 'https://www.instagram.com/reel/DbVV6NTPOj8/embed/',
    instagramUrl: 'https://www.instagram.com/reel/DbVV6NTPOj8/',
  },
  {
    id: 'DbtEjKEvREb',
    title: 'Your Perfect Gateway Spot with a View & Garden Vibes',
    thumbnail: '/gallery/narayani-river-break.jpg',
    videoUrl: 'https://www.instagram.com/reel/DbtEjKEvREb/embed/',
    instagramUrl: 'https://www.instagram.com/reel/DbtEjKEvREb/',
  },
  {
    id: 'Db3Nzatgb8F',
    title: 'Beautiful Views & Nightlife at Motimahal Restaurant & Lodge',
    thumbnail: '/gallery/narayani-river-gallery.jpg',
    videoUrl: 'https://www.instagram.com/reel/Db3Nzatgb8F/embed/',
    instagramUrl: 'https://www.instagram.com/reel/Db3Nzatgb8F/',
  },
];

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

  return (
    <section
      id="video-gallery"
      className="py-16 sm:py-24 border-b border-brand-border relative text-brand-charcoal bg-texture scroll-mt-20 sm:scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-brand-green text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
            Watch Our Stories
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal uppercase tracking-wider">
            FEATURED VIDEO 
          </h2>
        </div>

        {/* Video Cards Container: Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-5 sm:gap-8 max-w-6xl mx-auto pb-4 sm:pb-0 -mx-4 px-4 sm:mx-auto sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {INSTAGRAM_REELS.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group cursor-pointer flex flex-col items-center space-y-3 focus:outline-none w-[80vw] max-w-[320px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-start"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveVideo(video);
                }
              }}
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-stone-100 border border-brand-border shadow-xs group-hover:shadow-lg transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Caption */}
              <p className="font-medium text-stone-800 text-sm sm:text-base text-center leading-snug group-hover:text-brand-green transition-colors px-2">
                {video.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Lightbox */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-xl bg-stone-900 rounded-xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-800 bg-stone-950 text-white shrink-0">
              <div className="flex items-center gap-2 truncate pr-2">
                <InstagramIcon className="w-4 h-4 text-brand-gold shrink-0" />
                <h3 className="font-heading text-sm sm:text-base font-bold truncate text-stone-200">
                  {activeVideo.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeVideo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-brand-gold hover:bg-stone-800 transition-colors inline-flex items-center gap-1 text-xs font-medium"
                  title="Open on Instagram"
                >
                  <span className="hidden sm:inline">Open App</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reel Video Iframe Container */}
            <div className="relative w-full aspect-[9/16] max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
