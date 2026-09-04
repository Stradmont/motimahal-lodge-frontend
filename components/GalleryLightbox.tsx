'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryLightboxProps {
  isOpen: boolean;
  images: { url: string; title: string; caption?: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function GalleryLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-between p-4 backdrop-blur-xs">

      {/* Top Bar */}
      <div className="w-full flex items-center justify-between text-white py-2 px-4 max-w-7xl">
        <span className="text-xs text-white/90 font-semibold uppercase tracking-wider">
          Photo {currentIndex + 1} of {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4">
        <button
          onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer z-10 border border-white/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.url}
          alt={currentImage.title}
          className="max-h-[75vh] max-w-full object-contain rounded shadow-2xl"
        />

        <button
          onClick={() => onNavigate((currentIndex + 1) % images.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer z-10 border border-white/10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Caption Bottom Bar */}
      <div className="w-full max-w-2xl text-center text-white py-3.5 px-6 bg-black/80 rounded-2xl border border-white/15 backdrop-blur-md space-y-1 shadow-xl">
        <h4 className="font-heading text-lg sm:text-xl font-bold !text-white">{currentImage.title}</h4>
        {currentImage.caption && (
          <p className="text-xs sm:text-sm !text-stone-200 font-normal">{currentImage.caption}</p>
        )}
      </div>

    </div>
  );
}
