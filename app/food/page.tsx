'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { FOOD_MENU_DATA } from '@/lib/data';
import { Smartphone, QrCode, Flame } from 'lucide-react';

export default function FoodPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Set Menus', 'Tandoori & BBQ'];

  const filteredItems = activeCategory === 'All'
    ? FOOD_MENU_DATA
    : FOOD_MENU_DATA.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Motimahal Tandoori & In-Room Dining Menu"
          subtitle="Savor fresh clay-oven tandoori chicken, Nepali Thakali thali, and Narayani river fish. In-room ordering available directly via Stradmont Order QR."
          breadcrumbs={[{ label: 'Restaurant & Menu' }]}
        />

        {/* Stradmont Order QR Highlight Banner */}
        <section className="py-8 bg-[#FAF7F2] text-[#2D2B2A] border-b border-[#E6DFD5]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1F3A2B] text-white flex items-center justify-center shrink-0">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-[#1F3A2B]">
                  Staying in Our Lodge? Use In-Room Phone Ordering
                </h3>
                <p className="text-stone-600 text-xs mt-0.5">
                  Scan the Stradmont Order QR code inside your room to place food & drink orders directly to the kitchen from your phone.
                </p>
              </div>
            </div>

            <div className="shrink-0 text-xs font-semibold text-[#1F3A2B] bg-white px-4 py-2 rounded border border-[#E6DFD5] flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#1F3A2B]" />
              <span>Powered by Stradmont Order System</span>
            </div>
          </div>
        </section>

        {/* Menu Listing Grid */}
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

            {/* Food Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden shadow-xs flex flex-col justify-between group"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.isPopular && (
                      <span className="absolute top-3 left-3 bg-[#1F3A2B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Best Seller</span>
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 bg-[#1F3A2B] text-white text-xs font-bold px-3 py-1 rounded shadow">
                      NPR {item.priceNpr.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading text-xl font-bold text-[#1F3A2B] group-hover:text-[#162B20] transition-colors mb-2">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="bg-[#FAF7F2] text-[#1F3A2B] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#E6DFD5]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
