'use client';

import React from 'react';
import Link from 'next/link';
import { Room } from '@/lib/data';
import { Users, BedDouble, Check, Calendar, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const roomSlug = room.slug || room.id;

  return (
    <div className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden shadow-2xs flex flex-col justify-between group">
      {/* Card Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
        />
        <div className="absolute top-3 left-3 bg-[#1F3A2B] text-white text-xs font-medium px-2.5 py-1 rounded shadow-2xs">
          {room.category}
        </div>
        <div className="absolute bottom-3 right-3 bg-[#1F3A2B] text-white text-xs font-semibold px-3 py-1 rounded shadow-2xs">
          NPR {room.priceNpr.toLocaleString()} <span className="text-[10px] font-normal">/ night</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <h3 className="font-heading text-xl font-bold text-[#1F3A2B] group-hover:text-[#162B20] transition-colors">
            {room.name}
          </h3>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#1F3A2B]" />
              {room.capacity}
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-[#1F3A2B]" />
              {room.bedType}
            </span>
          </div>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
            {room.description}
          </p>
        </div>

        {/* Quick Amenities */}
        <div className="space-y-3 pt-3 border-t border-[#E6DFD5]">
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs bg-[#FAF7F2] text-stone-700 px-2.5 py-1 rounded border border-[#E6DFD5] font-medium"
              >
                <Check className="h-3 w-3 text-[#1F3A2B]" />
                {item}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Link
              href={`/rooms/${roomSlug}#enquiry-section`}
              className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs font-medium py-2.5 px-3 rounded-md text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book stay</span>
            </Link>

            <Link
              href={`/rooms/${roomSlug}`}
              className="bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#1F3A2B] border border-[#E6DFD5] text-xs font-medium py-2.5 px-3 rounded-md text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
