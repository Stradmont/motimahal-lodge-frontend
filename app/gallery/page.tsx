'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import GalleryLightbox from '@/components/GalleryLightbox';
import { GALLERY_DATA } from '@/lib/data';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Rooms', 'Dining', 'Lodge & Grounds', 'Safari & Surroundings'];

  const filteredItems = activeCategory === 'All'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((i) => i.category === activeCategory);

  const lightboxImages = filteredItems.map((item) => ({
    url: item.image,
    title: item.title,
    caption: item.caption,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Photo Gallery"
          subtitle="Explore atmospheric photography of our lodge, rooms, clay-oven kitchen, and surrounding Chitwan landscape."
          breadcrumbs={[{ label: 'Gallery' }]}
        />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6DFD5]">
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
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-4/3 rounded-lg overflow-hidden border border-[#E6DFD5] bg-stone-100 cursor-pointer shadow-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88A3B]">{item.category}</span>
                    <h4 className="font-heading text-base font-bold text-white transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          isOpen={true}
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </div>
  );
}
