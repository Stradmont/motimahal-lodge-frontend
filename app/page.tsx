'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import WhyChooseSection from '@/components/WhyChooseSection';
import AboutCarousel from '@/components/AboutCarousel';
import { ROOMS_DATA } from '@/lib/data';
import { Check, ArrowRight, QrCode } from 'lucide-react';

export default function HomePage() {
  const deluxeRoom = ROOMS_DATA[0];
  const suiteRoom = ROOMS_DATA[1];
  const standardRoom = ROOMS_DATA[2];

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
        <Hero />

        {/* 2. ABOUT US SECTION */}
        <section
          id="about"
          className="py-20 sm:py-28 border-b border-[#E6DFD5] relative text-[#2D2B2A] overflow-hidden"
          style={{
            backgroundImage: "url('/backs.png')",
            backgroundRepeat: 'repeat',
          }}
        >
          {/* Narrative Text Container (Aligned to Global Container Grid) */}
          <div className="mx-auto max-w-5xl px-6 text-center space-y-6 mb-14 sm:mb-18">
            <span className="text-[#1F3A2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
              About Us
            </span>

            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2D2B2A] leading-tight">
              Experience the Heart of Chitwan
            </h2>

            <div className="space-y-5 text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal max-w-4xl mx-auto">
              <p>
                Welcome to Motimahal Lodge and Restaurant, a family-owned establishment located in Bharatpur-10, Chitwan. Established three decades ago by our family, our lodge stands as a testament to our unwavering passion for hospitality, fresh local food, and quiet rest.
              </p>
              <p>
                Located just 5 minutes from the Narayani Riverfront promenade and 30 minutes drive from Chitwan National Park, guests enjoy easy access to river sunsets and wildlife safaris.
              </p>
              <p>
                At night, gather around our outdoor garden or restaurant tables to enjoy fresh tandoori grills prepared in our charcoal clay oven, continuous hot showers, and warm conversation with our family hosts.
              </p>
            </div>
          </div>

          {/* Full Viewport Width (Edge-to-Edge) Interactive Image Carousel */}
          <div className="w-full">
            <AboutCarousel />
          </div>
        </section>

        {/* 3. WHY CHOOSE MOTIMAHAL SECTION */}
        <WhyChooseSection />

        {/* 4. FULL-WIDTH BACKGROUND IMAGE — SECTION 1 */}
        <section className="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-stone-900 border-y border-[#E6DFD5]">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/narayani-river-break.jpg')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/35" />

          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <span className="text-white/95 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] block">
              NARAYANI RIVERFRONT PROMENADE
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-sm leading-tight">
              Where the river meets the quiet wilderness of Chitwan.
            </h2>
          </div>
        </section>

        {/* 5. ACCOMMODATION SECTION WITH backs.png BACKGROUND TEXTURE */}
        <section
          className="py-20 sm:py-28 border-b border-[#E6DFD5] relative text-[#2D2B2A]"
          style={{
            backgroundImage: "url('/backs.png')",
            backgroundRepeat: 'repeat',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#1F3A2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
                Stay With Us
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2D2B2A]">
                ACCOMMODATION
              </h2>
            </div>

            {/* Alternating Row 1 */}
            <div className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center shadow-xs">
              <div className="lg:col-span-7 lg:order-2 aspect-16/10 sm:aspect-auto h-80 sm:h-112 bg-stone-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={deluxeRoom.image}
                  alt={deluxeRoom.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 lg:order-1 p-8 sm:p-12 space-y-5">
                <span className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wider block">
                  From NPR {deluxeRoom.priceNpr.toLocaleString()} / night
                </span>
                <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#2D2B2A]">
                  {deluxeRoom.name}
                </h3>
                <p className="text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed">
                  {deluxeRoom.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-stone-600 pt-1">
                  {deluxeRoom.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="bg-white px-3.5 py-1.5 rounded border border-[#E6DFD5] flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                      <Check className="h-4 w-4 text-[#1F3A2B]" />
                      {amenity}
                    </span>
                  ))}
                </div>


              </div>
            </div>

            {/* Alternating Row 2 */}
            <div className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center shadow-xs">
              <div className="lg:col-span-7 aspect-16/10 sm:aspect-auto h-80 sm:h-112 bg-stone-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={suiteRoom.image}
                  alt={suiteRoom.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 space-y-5">
                <span className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wider block">
                  From NPR {suiteRoom.priceNpr.toLocaleString()} / night
                </span>
                <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#2D2B2A]">
                  {suiteRoom.name}
                </h3>
                <p className="text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed">
                  {suiteRoom.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-stone-600 pt-1">
                  {suiteRoom.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="bg-white px-3.5 py-1.5 rounded border border-[#E6DFD5] flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                      <Check className="h-4 w-4 text-[#1F3A2B]" />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-5">
                  <Link
                    href={`/rooms/${suiteRoom.slug || suiteRoom.id}#enquiry-section`}
                    className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-md transition-colors inline-block text-center"
                  >
                    Book Now
                  </Link>
                  <Link
                    href={`/rooms/${suiteRoom.slug || suiteRoom.id}`}
                    className="text-xs sm:text-sm font-bold text-[#1F3A2B] hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>

            {/* Alternating Row 3 */}
            <div className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center shadow-xs">
              <div className="lg:col-span-7 lg:order-2 aspect-16/10 sm:aspect-auto h-80 sm:h-112 bg-stone-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={standardRoom.image}
                  alt={standardRoom.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 lg:order-1 p-8 sm:p-12 space-y-5">
                <span className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wider block">
                  From NPR {standardRoom.priceNpr.toLocaleString()} / night
                </span>
                <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#2D2B2A]">
                  {standardRoom.name}
                </h3>
                <p className="text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed">
                  {standardRoom.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-stone-600 pt-1">
                  {standardRoom.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="bg-white px-3.5 py-1.5 rounded border border-[#E6DFD5] flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                      <Check className="h-4 w-4 text-[#1F3A2B]" />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-5">
                  <Link
                    href={`/rooms/${standardRoom.slug || standardRoom.id}#enquiry-section`}
                    className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-md transition-colors inline-block text-center"
                  >
                    Book Now
                  </Link>
                  <Link
                    href={`/rooms/${standardRoom.slug || standardRoom.id}`}
                    className="text-xs sm:text-sm font-bold text-[#1F3A2B] hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 10. ENQUIRY CTA SECTION WITH backs.png BACKGROUND TEXTURE */}
        <section
          className="py-20 sm:py-28 text-[#2D2B2A] text-center border-t border-[#E6DFD5] relative overflow-hidden"
          style={{
            backgroundImage: "url('/backs.png')",
            backgroundRepeat: 'repeat',
          }}
        >
          <div className="mx-auto max-w-4xl px-6 space-y-6">
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2D2B2A]">
              Planning Your Visit to Chitwan?
            </h2>
            <p className="text-stone-600 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">
              Tell us your stay dates or questions and our family front desk will assist you with direct room rates.
            </p>
            <div className="pt-2">
              <Link
                href="/enquiry"
                className="inline-flex items-center gap-2 bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-sm sm:text-base py-4 px-9 rounded-md transition-colors cursor-pointer shadow-xs"
              >
                <span>Check Availability & Enquire</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
