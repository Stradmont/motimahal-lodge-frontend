'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Room } from '@/lib/data';
import { Users, BedDouble, Check, Calendar, ArrowRight } from 'lucide-react';
import BookingModal from './BookingModal';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden shadow-xs flex flex-col justify-between group">
        
        {/* Card Image */}
        <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-[#1F3A2B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
            {room.category}
          </div>
          <div className="absolute bottom-3 right-3 bg-[#1F3A2B] text-white text-xs font-bold px-3 py-1 rounded shadow">
            NPR {room.priceNpr.toLocaleString()} <span className="text-[10px] font-normal">/ night</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-heading text-xl font-bold text-[#1F3A2B] group-hover:text-[#162B20] transition-colors">
              {room.name}
            </h3>
            
            <div className="flex items-center gap-4 text-xs text-stone-600 font-medium">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-[#1F3A2B]" />
                {room.capacity}
              </span>
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5 text-[#1F3A2B]" />
                {room.bedType}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
              {room.description}
            </p>
          </div>

          {/* Quick Amenities */}
          <div className="space-y-3 pt-2 border-t border-[#E6DFD5]">
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] bg-[#FAF7F2] text-stone-700 px-2 py-0.5 rounded border border-[#E6DFD5]"
                >
                  <Check className="h-3 w-3 text-[#1F3A2B]" />
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs font-semibold py-2.5 px-3 rounded text-center transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Book Stay</span>
              </button>

              <Link
                href={`/rooms/${room.id}`}
                className="bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#1F3A2B] border border-[#E6DFD5] text-xs font-semibold py-2.5 px-3 rounded text-center transition-colors flex items-center justify-center gap-1"
              >
                <span>Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoomId={room.id}
      />
    </>
  );
}
