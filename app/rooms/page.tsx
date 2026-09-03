'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import RoomCard from '@/components/RoomCard';
import AvailabilityBar from '@/components/AvailabilityBar';
import { ROOMS_DATA } from '@/lib/data';

export default function RoomsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Deluxe', 'Standard', 'Suite'];

  const filteredRooms = activeCategory === 'All'
    ? ROOMS_DATA
    : ROOMS_DATA.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          title="Lodge Accommodations & Room Rates"
          subtitle="Explore clean, air-conditioned rooms designed for quiet rest after travel or safari excursions."
          breadcrumbs={[{ label: 'Accommodations' }]}
        />

        {/* Availability Bar Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12">
          <AvailabilityBar />
        </div>

        {/* Category Filters & Room Grid */}
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 border-b border-[#E6DFD5]">
              <span className="text-xs font-semibold text-stone-500 mr-2 uppercase tracking-wider">Filter by Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#1F3A2B] text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-[#E6DFD5] hover:bg-[#F2ECE4]'
                  }`}
                >
                  {cat} {cat === 'All' ? `(${ROOMS_DATA.length})` : ''}
                </button>
              ))}
            </div>

            {/* Room Listing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            {/* Empty State */}
            {filteredRooms.length === 0 && (
              <div className="text-center py-16 bg-white rounded border border-[#E6DFD5] p-8">
                <p className="text-stone-600 text-sm">No rooms found matching the selected category.</p>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
