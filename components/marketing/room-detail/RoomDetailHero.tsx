'use client';

import React, { useState } from 'react';
import { Room } from '@/lib/data';
import { Maximize2 } from 'lucide-react';
import ImageLightboxModal from '@/components/ImageLightboxModal';

interface RoomDetailHeroProps {
  room: Room;
}

export default function RoomDetailHero({ room }: RoomDetailHeroProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <section
        onClick={() => setIsLightboxOpen(true)}
        className="relative w-full h-[48vh] min-h-[360px] flex items-center justify-center overflow-hidden bg-stone-900 cursor-pointer group"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('${room.image}')`,
          }}
        />
        <div className="absolute inset-0 z-10 bg-black/55 backdrop-blur-xs group-hover:bg-black/45 transition-colors" />

        <div className="relative z-20 mx-auto max-w-5xl px-6 text-center text-white space-y-4">
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white drop-shadow-md leading-tight">
            {room.name}
          </h1>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full border border-white/30 transition-all shadow-md cursor-pointer"
          >
            <Maximize2 className="h-4 w-4" />
            <span>Open FullScreen View</span>
          </button>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <ImageLightboxModal
        image={
          isLightboxOpen
            ? {
                src: room.image,
                title: room.name,
                caption: `${room.category} Accommodation at Motimahal Lodge`,
              }
            : null
        }
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
