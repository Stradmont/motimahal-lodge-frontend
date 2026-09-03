'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import BookingModal from '@/components/BookingModal';
import RoomCard from '@/components/RoomCard';
import { ROOMS_DATA } from '@/lib/data';
import { Users, BedDouble, Check, Calendar, ShieldCheck, Phone } from 'lucide-react';

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params?.id as string;
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const room = ROOMS_DATA.find((r) => r.id === roomId) || ROOMS_DATA[0];

  if (!room) {
    return notFound();
  }

  const relatedRooms = ROOMS_DATA.filter((r) => r.id !== room.id).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Header */}
        <PageHero
          title={room.name}
          subtitle={room.description}
          badge={room.category}
          breadcrumbs={[
            { label: 'Accommodations', href: '/rooms' },
            { label: room.name },
          ]}
          bgImage={room.image}
        />

        {/* Room Main Detail Section */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Media Gallery & Full Description */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Main Featured Photo */}
                <div className="relative rounded-lg overflow-hidden border border-[#E6DFD5] shadow-md bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-80 sm:h-108 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#1F3A2B] text-white text-sm font-bold px-4 py-2 rounded shadow">
                    NPR {room.priceNpr.toLocaleString()} <span className="text-xs font-normal">/ night</span>
                  </div>
                </div>

                {/* Overview & Quick Attributes */}
                <div className="bg-white p-6 rounded-lg border border-[#E6DFD5] shadow-xs space-y-6">
                  <div className="flex items-center gap-6 border-b border-[#E6DFD5] pb-4 flex-wrap text-xs text-stone-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#1F3A2B]" />
                      <span>Capacity: {room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-[#1F3A2B]" />
                      <span>Bedding: {room.bedType}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl font-bold text-[#1F3A2B] mb-3">
                      About This Room
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  {/* Room Amenities */}
                  <div>
                    <h4 className="font-heading text-lg font-bold text-[#1F3A2B] mb-3">
                      Included Room Amenities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {room.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-[#FAF7F2] p-2.5 rounded border border-[#E6DFD5]">
                          <Check className="h-4 w-4 text-[#1F3A2B]" />
                          <span className="font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Policies */}
                  <div className="pt-4 border-t border-[#E6DFD5] text-xs text-stone-500 space-y-1">
                    <p>• Standard Check-In: 12:00 PM | Standard Check-Out: 11:00 AM</p>
                    <p>• Cancellation: Free cancellation up to 24 hours prior to check-in date.</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Direct Booking & Enquiry Sidebar Widget */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-lg border-2 border-[#1F3A2B] shadow-md space-y-5 sticky top-24">
                  <div className="border-b border-[#E6DFD5] pb-3">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Starting Rate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading text-3xl font-bold text-[#1F3A2B]">NPR {room.priceNpr.toLocaleString()}</span>
                      <span className="text-xs text-stone-500">/ night</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setBookingModalOpen(true)}
                      className="w-full bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-xs sm:text-sm py-3.5 px-4 rounded transition-colors shadow cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Check Availability</span>
                    </button>
                    
                    <a
                      href="tel:+9779855012345"
                      className="w-full bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#1F3A2B] border border-[#E6DFD5] font-semibold text-xs py-3 px-4 rounded transition-all flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4 text-[#1F3A2B]" />
                      <span>Call Desk: +977 98550 12345</span>
                    </a>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded text-[11px] text-stone-600 space-y-1 border border-[#E6DFD5]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1F3A2B]">
                      <ShieldCheck className="h-4 w-4 text-[#1F3A2B]" />
                      <span>Direct Booking Advantage</span>
                    </div>
                    <p>No booking fees. Direct confirmation & eSewa payment available.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Related Rooms */}
            {relatedRooms.length > 0 && (
              <div className="mt-16 pt-12 border-t border-[#E6DFD5]">
                <h3 className="font-heading text-2xl font-bold text-[#1F3A2B] mb-6">
                  Other Accommodation Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedRooms.map((r) => (
                    <RoomCard key={r.id} room={r} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoomId={room.id}
      />
    </div>
  );
}
