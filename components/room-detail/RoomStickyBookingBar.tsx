'use client';

import React from 'react';
import { Room } from '@/lib/data';
import { Calendar, Phone } from 'lucide-react';

interface RoomStickyBookingBarProps {
  room: Room;
  todayStr: string;
  checkIn: string;
  setCheckIn: (d: string) => void;
  checkOut: string;
  setCheckOut: (d: string) => void;
  nights: number;
  estimatedTotal: number;
  onScrollToEnquiry: () => void;
}

export default function RoomStickyBookingBar({
  room,
  todayStr,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  nights,
  estimatedTotal,
  onScrollToEnquiry,
}: RoomStickyBookingBarProps) {
  return (
    <>
      {/* DESKTOP STICKY CARD */}
      <div className="hidden lg:block lg:col-span-4">
        <div className="sticky top-28 bg-white p-7 rounded-xl border border-brand-border shadow-md space-y-6">
          <div className="border-b border-brand-border pb-4 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
                {room.category} room
              </span>
              <h3 className="font-heading text-xl font-bold text-brand-charcoal">
                {room.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="font-heading text-2xl font-bold text-brand-green">
                NPR {room.priceNpr.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500 block">/ night</span>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Check-in</label>
                <input
                  type="date"
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Check-out</label>
                <input
                  type="date"
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <div className="bg-brand-surface p-3.5 rounded-lg border border-brand-border flex items-center justify-between">
              <span className="text-stone-700 font-medium text-xs sm:text-sm">NPR {room.priceNpr.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
              <span className="font-bold text-base text-brand-green">NPR {estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onScrollToEnquiry}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold text-sm py-3.5 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <Calendar className="h-4.5 w-4.5" />
            <span>Reserve this room</span>
          </button>

          <div className="pt-2 text-center border-t border-brand-border">
            <a
              href="tel:+9779855012345"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline"
            >
              <Phone className="h-4 w-4 text-brand-green" />
              <span>Call +977 98550 12345</span>
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-brand-border px-4 py-3.5 shadow-lg backdrop-blur-md flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-stone-600 block">
            {room.name}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-xl font-bold text-brand-green">
              NPR {room.priceNpr.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500">/ night</span>
          </div>
        </div>

        <button
          onClick={onScrollToEnquiry}
          className="bg-brand-green hover:bg-brand-green-dark text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-lg transition-colors shrink-0"
        >
          Check dates
        </button>
      </div>
    </>
  );
}
