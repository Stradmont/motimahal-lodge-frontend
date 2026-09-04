'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Room } from '@/lib/data';
import { Users, BedDouble, Check, Calendar, ArrowRight, Maximize2 } from 'lucide-react';
import ImageLightboxModal from '@/components/ImageLightboxModal';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const roomSlug = room.slug || room.id;

  return (
    <>
      <div className="bg-white rounded-lg border border-brand-border overflow-hidden shadow-2xs flex flex-col justify-between group">
        {/* Card Image */}
        <div
          className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer group/img"
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
          />
          <div className="absolute top-3 left-3 bg-brand-green text-white text-xs font-medium px-2.5 py-1 rounded shadow-2xs">
            {room.category}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            aria-label="View FullScreen Image"
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs transition-all shadow-md cursor-pointer opacity-90 group-hover/img:opacity-100"
            title="FullScreen View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 right-3 bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded shadow-2xs">
            NPR {room.priceNpr.toLocaleString()} <span className="text-[10px] font-normal">/ night</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <h3 className="font-heading text-xl font-bold text-brand-green group-hover:text-brand-green-dark transition-colors">
              <Link href={`/rooms/${roomSlug}`}>{room.name}</Link>
            </h3>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-brand-green" />
                {room.capacity}
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-3.5 w-3.5 text-brand-green" />
                {room.bedType}
              </span>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
              {room.description}
            </p>
          </div>

          {/* Quick Amenities */}
          <div className="space-y-3 pt-3 border-t border-brand-border">
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs bg-brand-surface text-stone-700 px-2.5 py-1 rounded border border-brand-border font-medium"
                >
                  <Check className="h-3 w-3 text-brand-green" />
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                href={`/rooms/${roomSlug}#enquiry-section`}
                className="bg-brand-green hover:bg-brand-green-dark text-white text-xs font-medium py-2.5 px-3 rounded-md text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Book stay</span>
              </Link>

              <Link
                href={`/rooms/${roomSlug}`}
                className="bg-brand-surface hover:bg-stone-200/50 text-brand-green border border-brand-border text-xs font-medium py-2.5 px-3 rounded-md text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        image={
          isLightboxOpen
            ? {
                src: room.image,
                title: room.name,
                caption: `${room.category} — NPR ${room.priceNpr.toLocaleString()} / night`,
              }
            : null
        }
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
