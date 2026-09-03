'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import RoomCard from '@/components/RoomCard';
import WhyChooseSection from '@/components/WhyChooseSection';
import { ROOMS_DATA } from '@/lib/data';

export default function RoomsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Accommodations"
          subtitle="Clean air-conditioned rooms, quiet garden surroundings, and 24/7 solar hot water in Bharatpur-10."
          breadcrumbs={[{ label: 'Accommodations' }]}
        />

        <section
          className="py-16 sm:py-24 border-b border-[#E6DFD5]"
          style={{
            backgroundImage: "url('/backs.png')",
            backgroundRepeat: 'repeat',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ROOMS_DATA.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </section>

        <WhyChooseSection />
      </main>

      <Footer />
    </div>
  );
}
