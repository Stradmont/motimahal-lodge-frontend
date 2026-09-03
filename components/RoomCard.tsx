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
          <div className="absolute top-3 left-3 bg-[#1F3A2B] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow">
            {room.category}
          </div>
          <div className="absolute bottom-3 right-3 bg-[#1F3A2B] text-white text-sm font-bold px-3.5 py-1.5 rounded shadow">
            NPR {room.priceNpr.toLocaleString()} <span className="text-xs font-normal">/ night</span>
          </div>
        </div>

        {/* Card Body with spacious padding */}
        <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A2B] group-hover:text-[#162B20] transition-colors">
              {room.name}
            </h3>

            <div className="flex items-center gap-5 text-sm text-stone-700 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#1F3A2B]" />
                {room.capacity}
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-[#1F3A2B]" />
                {room.bedType}
              </span>
            </div>

            {/* Room Card Description: Increased to text-base sm:text-lg for luxurious readability */}
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
              {room.description}
            </p>
          </div>

          {/* Quick Amenities */}
          <div className="space-y-4 pt-3 border-t border-[#E6DFD5]">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-[#FAF7F2] text-stone-700 px-3 py-1 rounded border border-[#E6DFD5] font-medium"
                >
                  <Check className="h-3.5 w-3.5 text-[#1F3A2B]" />
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs uppercase tracking-wider"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Stay</span>
              </button>

              <Link
                href={`/rooms/${room.id}`}
                className="bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#1F3A2B] border border-[#E6DFD5] text-xs sm:text-sm font-semibold py-3 px-4 rounded text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Details</span>
                <ArrowRight className="h-4 w-4" />
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
