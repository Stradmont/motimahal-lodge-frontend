'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyChooseSection from '@/components/WhyChooseSection';
import BookingModal from '@/components/BookingModal';
import { ROOMS_DATA } from '@/lib/data';
import { Check, Calendar, ArrowRight, ThermometerSun, ShowerHead, Wifi, Coffee } from 'lucide-react';

export default function RoomsPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();

  const handleOpenBooking = (roomId?: string) => {
    setSelectedRoomId(roomId);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[60vh] min-h-[440px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2000')`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/50" />

          <div className="relative z-20 mx-auto max-w-5xl px-6 text-center text-white space-y-4">
            <span className="text-white/95 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] block">
              STAY WITH US
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              ROOMS & ACCOMMODATION
            </h1>
          </div>
        </section>

        {/* 2. ROOMS LISTING SECTION WITH backs.png BACKGROUND TEXTURE */}
        <section
          className="py-16 sm:py-24 border-b border-[#E6DFD5] relative text-[#2D2B2A]"
          style={{
            backgroundImage: "url('/backs.png')",
            backgroundRepeat: 'repeat',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Section Sub-Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D2B2A] tracking-wider uppercase">
                OUR ACCOMMODATIONS
              </h2>
              <p className="text-stone-600 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
                Every room is maintained with fresh linens, quiet air conditioning, attached ensuite bathroom, and friendly family service.
              </p>
            </div>

            {/* Alternating Horizontal Room Cards Layout */}
            <div className="space-y-12">
              {ROOMS_DATA.map((room, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={room.id}
                    className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center shadow-xs group"
                  >
                    {/* Room Image */}
                    <div
                      className={`lg:col-span-7 ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      } aspect-16/10 sm:aspect-auto h-80 sm:h-112 bg-stone-100 overflow-hidden relative`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-[#1F3A2B] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded shadow">
                        {room.category}
                      </div>
                    </div>

                    {/* Room Content */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      } p-8 sm:p-12 space-y-5`}
                    >
                      <div className="flex items-baseline justify-between gap-2 border-b border-[#E6DFD5] pb-3">
                        <span className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wider">
                          Nightly Rate
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A2B]">
                            NPR {room.priceNpr.toLocaleString()}
                          </span>
                          <span className="text-xs text-stone-500">/ night</span>
                        </div>
                      </div>

                      <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#2D2B2A] group-hover:text-[#1F3A2B] transition-colors">
                        {room.name}
                      </h2>

                      <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                        {room.description}
                      </p>

                      {/* Key Amenities Badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {room.amenities.map((amenity, aIdx) => (
                          <span
                            key={aIdx}
                            className="bg-[#FAF7F2] text-stone-700 text-xs sm:text-sm px-3 py-1.5 rounded border border-[#E6DFD5] font-medium flex items-center gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5 text-[#1F3A2B]" />
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Action CTAs: Book Now + View Details */}
                      <div className="pt-4 flex items-center gap-4 flex-wrap">
                        <button
                          onClick={() => handleOpenBooking(room.id)}
                          className="bg-[#1F3A2B] hover:bg-[#162B20] border border-[#2D4D3B] text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-md transition-all cursor-pointer tracking-wider uppercase shadow-xs flex items-center gap-2"
                          style={{
                            backgroundImage: "linear-gradient(rgba(31, 58, 43, 0.88), rgba(31, 58, 43, 0.88)), url('/backs.png')",
                            backgroundRepeat: 'repeat',
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Book Now</span>
                        </button>

                        <Link
                          href={`/rooms/${room.id}`}
                          className="bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#1F3A2B] border border-[#E6DFD5] text-xs sm:text-sm font-bold px-6 py-3.5 rounded-md transition-colors inline-flex items-center gap-2"
                        >
                          <span>View Details</span>
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

        {/* 2. INCLUDED AMENITIES SECTION */}
        <section className="py-20 sm:py-28 bg-white border-b border-[#E6DFD5]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#1F3A2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
                Included Comforts
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2D2B2A]">
                LODGE AMENITIES & SERVICES
              </h2>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
                Everything you need for a restful stay in Chitwan, whether visiting for business, travel, or wildlife safari.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

              <div className="bg-[#FAF7F2] p-8 rounded-lg border border-[#E6DFD5] space-y-4 shadow-2xs">
                <div className="w-12 h-12 bg-white rounded-lg border border-[#E6DFD5] flex items-center justify-center text-[#1F3A2B]">
                  <ThermometerSun className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#2D2B2A]">Silent Air Conditioning</h3>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                  Individual AC units in every room keep your room cool during hot Chitwan afternoons.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-8 rounded-lg border border-[#E6DFD5] space-y-4 shadow-2xs">
                <div className="w-12 h-12 bg-white rounded-lg border border-[#E6DFD5] flex items-center justify-center text-[#1F3A2B]">
                  <ShowerHead className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#2D2B2A]">24/7 Solar Hot Water</h3>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                  Enjoy continuous hot showers after a long day of highway travel or jungle safari walks.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-8 rounded-lg border border-[#E6DFD5] space-y-4 shadow-2xs">
                <div className="w-12 h-12 bg-white rounded-lg border border-[#E6DFD5] flex items-center justify-center text-[#1F3A2B]">
                  <Wifi className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#2D2B2A]">Complimentary Wi-Fi</h3>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                  High-speed internet access throughout all rooms, outdoor garden, and dining area.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-8 rounded-lg border border-[#E6DFD5] space-y-4 shadow-2xs">
                <div className="w-12 h-12 bg-white rounded-lg border border-[#E6DFD5] flex items-center justify-center text-[#1F3A2B]">
                  <Coffee className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#2D2B2A]">On-Site Tandoori Kitchen</h3>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                  Order clay-oven tandoori grills, fresh Naan bread, or authentic Nepali thali set meals directly to your room.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 3. WHY CHOOSE MOTIMAHAL SECTION */}
        <WhyChooseSection />

        {/* 4. FINAL BOOKING CTA SECTION */}
        <section className="py-20 sm:py-28 bg-[#FAF7F2] text-[#2D2B2A] text-center border-t border-[#E6DFD5]">
          <div className="mx-auto max-w-4xl px-6 space-y-6">
            <span className="text-[#1F3A2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
              Direct Reservation
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2D2B2A]">
              Reserve Your Room Directly with Our Family
            </h2>
            <p className="text-stone-600 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed font-normal">
              Book directly with Motimahal Lodge for the best guaranteed nightly rates, airport pickup, and Chitwan safari assistance.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleOpenBooking()}
                className="bg-[#1F3A2B] hover:bg-[#162B20] border border-[#2D4D3B] text-white font-semibold text-sm sm:text-base py-4 px-9 rounded-md transition-all cursor-pointer tracking-wider uppercase shadow-xs"
                style={{
                  backgroundImage: "linear-gradient(rgba(31, 58, 43, 0.88), rgba(31, 58, 43, 0.88)), url('/backs.png')",
                  backgroundRepeat: 'repeat',
                }}
              >
                Check Room Availability & Enquire
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoomId={selectedRoomId}
      />
    </div>
  );
}
