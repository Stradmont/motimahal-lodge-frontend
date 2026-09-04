'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export interface LightboxImage {
  src: string;
  title?: string;
  caption?: string;
  alt?: string;
}

interface ImageLightboxModalProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export default function ImageLightboxModal({ image, onClose }: ImageLightboxModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (image) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [image, handleKeyDown]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-lg"
        aria-label="Close fullscreen view"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Lightbox Content Container */}
      <div className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4 pointer-events-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt || image.title || 'Fullscreen View'}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg border border-stone-800 shadow-2xl"
        />
        {(image.title || image.caption) && (
          <div className="text-center space-y-1">
            {image.title && (
              <p className="text-white font-heading text-lg sm:text-xl font-semibold text-center drop-shadow-md">
                {image.title}
              </p>
            )}
            {image.caption && (
              <p className="text-stone-300 text-xs sm:text-sm font-normal text-center drop-shadow-xs">
                {image.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
