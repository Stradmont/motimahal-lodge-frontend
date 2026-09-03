'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import WhyChooseSection from '@/components/WhyChooseSection';
import BookingModal from '@/components/BookingModal';
import { ROOMS_DATA, TESTIMONIALS_DATA } from '@/lib/data';
import { Check, ArrowRight, QrCode } from 'lucide-react';

export default function HomePage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();

  const deluxeRoom = ROOMS_DATA[0];
  const suiteRoom = ROOMS_DATA[1];
  const standardRoom = ROOMS_DATA[2];

  const handleOpenBooking = (roomId?: string) => {
    setSelectedRoomId(roomId);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <Hero />

        {/* 2. ABOUT US SECTION */}
        <section
          id="about"
          className="py-20 sm:py-28 border-b border-[#E6DFD5] relative text-[#2D2B2A]"
          style={{
            backgroundImage: "url('/backs.png')",
            backgroundRepeat: 'repeat',
          }}
        >
          <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
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

          {/* Panoramic Horizontal Photo Ribbon */}
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-lg overflow-hidden border border-[#E6DFD5] aspect-4/3 bg-stone-100 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800"
                  alt="Motimahal Lodge Grounds"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border border-[#E6DFD5] aspect-4/3 bg-stone-100 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"
                  alt="Clean AC Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border border-[#E6DFD5] aspect-4/3 bg-stone-100 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?auto=format&fit=crop&q=80&w=800"
                  alt="Clay Oven Tandoori Cooking"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHY CHOOSE MOTIMAHAL SECTION */}
        <WhyChooseSection />

        {/* 4. FULL-WIDTH BACKGROUND IMAGE — SECTION 1 */}
        <section className="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-stone-900 border-y border-[#E6DFD5]">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000')`,
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
                    <span key={idx} className="bg-[#FAF7F2] px-3.5 py-1.5 rounded border border-[#E6DFD5] flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                      <Check className="h-4 w-4 text-[#1F3A2B]" />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-5">
                  <button
                    onClick={() => handleOpenBooking(deluxeRoom.id)}
                    className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-full transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Book Now
                  </button>
                  <Link
                    href={`/rooms/${deluxeRoom.id}`}
                    className="text-xs sm:text-sm font-bold text-[#1F3A2B] hover:underline"
                  >
                    Details →
                  </Link>
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
                    <span key={idx} className="bg-[#FAF7F2] px-3.5 py-1.5 rounded border border-[#E6DFD5] flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                      <Check className="h-4 w-4 text-[#1F3A2B]" />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-5">
                  <button
                    onClick={() => handleOpenBooking(suiteRoom.id)}
                    className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-full transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Book Now
                  </button>
                  <Link
                    href={`/rooms/${suiteRoom.id}`}
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
                    <span key={idx} className="bg-[#FAF7F2] px-3.5 py-1.5 rounded border border-[#E6DFD5] flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                      <Check className="h-4 w-4 text-[#1F3A2B]" />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-5">
                  <button
                    onClick={() => handleOpenBooking(standardRoom.id)}
                    className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-full transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Book Now
                  </button>
                  <Link
                    href={`/rooms/${standardRoom.id}`}
                    className="text-xs sm:text-sm font-bold text-[#1F3A2B] hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. TANDOORI DINING & STRADMONT ORDER SECTION */}
        <section className="py-20 sm:py-28 bg-white border-b border-[#E6DFD5]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 rounded-lg overflow-hidden border border-[#E6DFD5] h-88 sm:h-112 bg-stone-100 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?auto=format&fit=crop&q=80&w=1200"
                  alt="Fresh Clay Oven Tandoori Cooking"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-6 space-y-6">
                <span className="text-[#1F3A2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
                  Restaurant & Dining
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2D2B2A] leading-tight">
                  Tandoori Kitchen & In-Room QR Dining
                </h2>
                
                <div className="space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed">
                  <p>
                    Our restaurant features an authentic clay tandoor oven where fresh chicken, fish, and naan bread are roasted over natural charcoal heat daily.
                  </p>
                  <p>
                    Staying in one of our rooms? Simply scan the Stradmont Order QR code on your nightstand to order fresh meals directly to your room door from your phone.
                  </p>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Link
                    href="/food"
                    className="bg-[#1F3A2B] hover:bg-[#162B20] text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-full transition-colors inline-flex items-center gap-2 uppercase tracking-wider"
                  >
                    <span>View Menu & Pricing</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 bg-[#FAF7F2] px-5 py-3 rounded-full border border-[#E6DFD5]">
                    <QrCode className="h-4 w-4 text-[#1F3A2B]" />
                    <span>In-Room QR Order Supported</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. CHITWAN SAFARI & EXPERIENCES SECTION */}
        <section className="py-20 sm:py-28 bg-[#FAF7F2] border-b border-[#E6DFD5]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#1F3A2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
                Local Surroundings
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2D2B2A]">
                CHITWAN EXPERIENCES
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white p-8 sm:p-12 rounded-lg border border-[#E6DFD5] shadow-xs">
              <div className="lg:col-span-7 rounded-lg overflow-hidden border border-[#E6DFD5] h-80 sm:h-104">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1547970810-dc9223d49122?auto=format&fit=crop&q=80&w=1200"
                  alt="Chitwan Wildlife Safari"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wider block">
                  18 km (30 mins drive from lodge)
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2B2A]">
                  Chitwan National Park Jungle Safari
                </h3>
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                  Home to the endangered One-Horned Rhinoceros, Bengal Tigers, and wild elephants. Our family front desk assists guests in arranging jeep safaris, canoe trips, and guided walks.
                </p>
                <div className="pt-2">
                  <Link
                    href="/attractions"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1F3A2B] border-b-2 border-[#1F3A2B] pb-1 hover:underline"
                  >
                    <span>View All Local Attractions →</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 8. FULL-WIDTH BACKGROUND IMAGE — SECTION 2 */}
        <section className="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-stone-900 border-y border-[#E6DFD5]">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2000')`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/35" />

          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <span className="text-white/95 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] block">
              EVENING AT MOTIMAHAL
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-sm leading-tight">
              Gather around the garden, share stories, and rest under the Chitwan stars.
            </h2>
          </div>
        </section>

        {/* 9. GUEST REVIEWS SECTION */}
        <section className="py-20 sm:py-28 bg-white border-b border-[#E6DFD5]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12 text-center">
            <span className="text-[#1F3A2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
              Guest Testimonials
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2D2B2A]">
              GUEST REFLECTIONS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {TESTIMONIALS_DATA.map((rev) => (
                <div key={rev.id} className="bg-[#FAF7F2] p-8 rounded-lg border border-[#E6DFD5] space-y-5 flex flex-col justify-between shadow-xs">
                  <p className="text-stone-700 text-base sm:text-lg leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-[#E6DFD5]">
                    <span className="font-bold text-[#2D2B2A] text-sm sm:text-base block">{rev.name}</span>
                    <span className="text-xs sm:text-sm text-stone-500">{rev.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1F3A2B] border-b-2 border-[#1F3A2B] pb-1"
              >
                <span>Read More Reviews →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 10. ENQUIRY CTA SECTION */}
        <section className="py-20 sm:py-28 bg-[#FAF7F2] text-[#2D2B2A] text-center border-t border-[#E6DFD5]">
          <div className="mx-auto max-w-4xl px-6 space-y-6">
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2D2B2A]">
              Planning Your Visit to Chitwan?
            </h2>
            <p className="text-stone-600 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">
              Tell us your stay dates or questions and our family front desk will assist you with direct room rates.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleOpenBooking()}
                className="bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-sm sm:text-base py-4 px-9 rounded-full transition-colors cursor-pointer tracking-wider uppercase shadow-xs"
              >
                Check Availability & Enquire
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
