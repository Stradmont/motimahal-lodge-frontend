'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyChooseSection from '@/components/WhyChooseSection';
import WhatToExpectSection from '@/components/WhatToExpectSection';
import { ROOMS_DATA } from '@/lib/data';
import { Check, Calendar, ArrowRight, ThermometerSun, ShowerHead, Wifi, Coffee } from 'lucide-react';

export default function RoomsPage() {
  return (
    <div
      className="min-h-screen flex flex-col text-[#2D2B2A]"
      style={{
        backgroundImage: "url('/backs.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[45vh] min-h-[360px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1800')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xs" />

          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white drop-shadow-md leading-tight">
              Rooms & Accommodation
            </h1>
            <p className="text-stone-200 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
              Clean, quiet, and comfortable rooms with hot showers, fresh linens, and warm Nepalese hospitality.
            </p>
          </div>
        </section>

        {/* 2. ROOM LISTING GRID */}
        <section className="py-16 sm:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D2B2A]">
                Our Available Room Categories
              </h2>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
                Choose the right room for your Chitwan trip — from budget standard rooms to spacious AC family suites.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {ROOMS_DATA.map((room) => {
                return (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl border border-[#E6DFD5] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Header */}
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-[#1F3A2B] text-white text-xs font-semibold px-3 py-1 rounded shadow-md">
                        {room.category}
                      </div>

                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-md border border-[#E6DFD5] text-[#1F3A2B] font-bold text-sm shadow-md">
                        NPR {room.priceNpr.toLocaleString()} <span className="text-xs font-normal text-stone-600">/ night</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2B2A] group-hover:text-[#1F3A2B] transition-colors">
                          {room.name}
                        </h3>
                        <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-normal line-clamp-3">
                          {room.description}
                        </p>

                        {/* Room Key Specs */}
                        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600 font-medium">
                          <span>👤 {room.capacity}</span>
                          <span>•</span>
                          <span>🛏️ {room.bedType}</span>
                          {room.sizeSqFt && (
                            <>
                              <span>•</span>
                              <span>📐 {room.sizeSqFt} sq. ft</span>
                            </>
                          )}
                        </div>

                        {/* Amenities Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {room.amenities.map((amenity, aIdx) => (
                            <span
                              key={aIdx}
                              className="bg-[#FAF7F2] text-stone-700 text-xs px-2.5 py-1 rounded border border-[#E6DFD5] font-medium flex items-center gap-1.5"
                            >
                              <Check className="h-3 w-3 text-[#1F3A2B]" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action CTAs: Book Now + View Details */}
                      <div className="pt-3 flex items-center gap-3 flex-wrap">
                        <Link
                          href={`/rooms/${room.slug}#enquiry-section`}
                          className="bg-[#1F3A2B] hover:bg-[#162B20] border border-[#2D4D3B] text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-md transition-all cursor-pointer shadow-xs flex items-center gap-2"
                          style={{
                            backgroundImage: "linear-gradient(rgba(31, 58, 43, 0.88), rgba(31, 58, 43, 0.88)), url('/backs.png')",
                            backgroundRepeat: 'repeat',
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Book now</span>
                        </Link>

                        <Link
                          href={`/rooms/${room.slug}`}
                          className="bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#1F3A2B] border border-[#E6DFD5] text-xs sm:text-sm font-medium px-5 py-2.5 rounded-md transition-colors inline-flex items-center gap-2"
                        >
                          <span>View details</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. WHY CHOOSE MOTIMAHAL SECTION */}
        {/* 4. WHAT TO EXPECT SECTION */}
        <WhatToExpectSection />

        {/* 5. FINAL BOOKING CTA SECTION */}
        <section className="py-12 sm:py-16 bg-[#FAF7F2] text-[#2D2B2A] text-center border-t border-[#E6DFD5]">
          <div className="mx-auto max-w-3xl px-6 space-y-4">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2B2A]">
              Reserve your room directly with our family
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-normal">
              Book directly with Motimahal Lodge for guaranteed nightly rates, airport pickup, and Chitwan safari assistance.
            </p>
            <div className="pt-2">
              <Link
                href="/enquiry"
                className="inline-flex items-center gap-2 bg-[#1F3A2B] hover:bg-[#162B20] border border-[#2D4D3B] text-white font-medium text-sm py-3.5 px-8 rounded-md transition-all cursor-pointer shadow-xs"
                style={{
                  backgroundImage: "linear-gradient(rgba(31, 58, 43, 0.88), rgba(31, 58, 43, 0.88)), url('/backs.png')",
                  backgroundRepeat: 'repeat',
                }}
              >
                <span>Check room availability & enquiry</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
