'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string; // Embed URL e.g. https://www.youtube.com/embed/... or Facebook embed
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: '1',
    title: 'Visiting Nepal in October 2022',
    thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  },
  {
    id: '2',
    title: 'Visiting Nepal in October 2022',
    thumbnail: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
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
      className="py-16 sm:py-24 border-b border-[#E6DFD5] relative text-[#2D2B2A]"
      style={{
        backgroundImage: "url('/backs.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2B2A] uppercase tracking-wider">
            VIDEO
          </h2>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-center max-w-4xl mx-auto">
          {DEFAULT_VIDEOS.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group cursor-pointer flex flex-col items-center space-y-3 focus:outline-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveVideo(video);
                }
              }}
            >
              {/* Thumbnail Container (Clean, direct image click without play icon) */}
              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#E6DFD5] shadow-xs group-hover:shadow-md transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>

              {/* Caption */}
              <p className="font-medium text-stone-800 text-sm sm:text-base text-center leading-snug group-hover:text-[#1F3A2B] transition-colors">
                {video.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Lightbox */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-stone-900 rounded-xl overflow-hidden shadow-2xl border border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-800 bg-stone-950 text-white">
              <h3 className="font-heading text-base sm:text-xl font-bold truncate pr-4 text-stone-200">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Video Iframe Container */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
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
