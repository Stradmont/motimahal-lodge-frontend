'use client';

import React from 'react';
import { Maximize2 } from 'lucide-react';

interface ExpandableImageCardProps {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  aspectRatio?: string;
  className?: string;
  onClick?: () => void;
}

export default function ExpandableImageCard({
  src,
  alt,
  title,
  caption,
  aspectRatio = 'aspect-16/10',
  className = '',
  onClick,
}: ExpandableImageCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl overflow-hidden border border-brand-border shadow-md hover:shadow-xl transition-all duration-300 relative group bg-stone-100 cursor-pointer ${aspectRatio} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || title || 'Image'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Hover Fullscreen Overlay Icon Button */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
        <div className="p-3.5 rounded-full bg-black/60 text-white border border-white/30 backdrop-blur-xs transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg">
          <Maximize2 className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Bottom Caption Bar */}
      {(title || caption) && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/75 via-black/35 to-transparent flex items-center justify-between pointer-events-none">
          <span className="text-white font-medium text-xs sm:text-sm drop-shadow-xs truncate pr-2">
            {title || caption}
          </span>
       
        </div>
      )}
    </div>
  );
}
