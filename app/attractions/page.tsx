'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import AttractionCard from '@/components/AttractionCard';
import { ATTRACTIONS_DATA } from '@/lib/data';

export default function AttractionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          title="Attractions Near Motimahal Lodge"
          subtitle="Explore wildlife safaris, golden riverfront sunsets, Tharu cultural heritage, and sacred pilgrimage destinations around Chitwan."
          breadcrumbs={[{ label: 'Attractions in Chitwan' }]}
        />

        {/* Attractions Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ATTRACTIONS_DATA.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
