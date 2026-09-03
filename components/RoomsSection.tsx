'use client';

import React from 'react';
import Link from 'next/link';
import { ROOMS_DATA } from '@/lib/data';
import RoomCard from './RoomCard';
import { ArrowRight } from 'lucide-react';

export default function RoomsSection() {
  return (
    <section id="rooms" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DFD5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#9E4B27] text-xs font-semibold uppercase tracking-wider block mb-1">
              Accommodations & Lodging
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F3A2B]">
              Our Recommended Guest Rooms
            </h2>
            <p className="text-stone-600 text-sm max-w-xl mt-2 leading-relaxed">
              Clean, quiet, and equipped with silent split air conditioning, continuous solar-electric hot showers, and fiber Wi-Fi.
            </p>
          </div>

          <div>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#9E4B27] hover:text-[#853C1D] uppercase tracking-wider py-2 transition-colors border-b-2 border-[#9E4B27]"
            >
              <span>View All Rooms & Rates</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ROOMS_DATA.slice(0, 3).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

      </div>
    </section>
  );
}
