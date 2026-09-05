import React from 'react';
import Link from 'next/link';
import { Room } from '@/lib/data';
import { Users, BedDouble, Maximize2, ArrowLeft, ChevronRight } from 'lucide-react';

interface RoomDetailHeaderProps {
  room: Room;
}

export default function RoomDetailHeader({ room }: RoomDetailHeaderProps) {
  return (
    <section
      className="py-10 sm:py-14 border-b border-brand-border text-brand-charcoal"
      style={{
        backgroundImage: "url('/textures/backs-2.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4 text-left">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium pb-2">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 text-brand-green hover:text-brand-green/80 transition-colors font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Rooms</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <span className="text-stone-700 truncate max-w-[200px] sm:max-w-none">{room.name}</span>
        </div>

        {/* Price Subtitle */}
        <span className="text-brand-green text-base sm:text-lg font-bold block">
          From NPR {room.priceNpr.toLocaleString()} / night
        </span>

        {/* Room Title */}
        <h2 className="font-heading text-4xl sm:text-6xl font-bold text-brand-charcoal leading-tight">
          {room.name}
        </h2>

        {/* Short Description */}
        <p className="text-stone-800 text-lg sm:text-xl max-w-3xl leading-relaxed font-normal">
          {room.description}
        </p>

        {/* Quick Specs Badges */}
        <div className="pt-4 flex flex-wrap items-center gap-4 text-sm sm:text-base text-stone-800 font-medium">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-brand-border shadow-2xs">
            <Users className="h-5 w-5 text-brand-green" />
            <span>{room.capacity}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-brand-border shadow-2xs">
            <BedDouble className="h-5 w-5 text-brand-green" />
            <span>{room.bedType}</span>
          </div>
          {room.sizeSqFt && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-brand-border shadow-2xs">
              <Maximize2 className="h-5 w-5 text-brand-green" />
              <span>{room.sizeSqFt} sq. ft</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
