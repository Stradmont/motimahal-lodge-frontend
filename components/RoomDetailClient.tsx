'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import WhatToExpectSection from '@/components/WhatToExpectSection';
import CtaSection from '@/components/CtaSection';
import { Room, ROOMS_DATA } from '@/lib/data';

import RoomDetailHero from './marketing/room-detail/RoomDetailHero';
import RoomDetailHeader from './marketing/room-detail/RoomDetailHeader';
import RoomSpotlightGallery from './marketing/room-detail/RoomSpotlightGallery';
import RoomAmenitiesSection from './marketing/room-detail/RoomAmenitiesSection';
import RoomEnquirySection from './marketing/room-detail/RoomEnquirySection';
import RoomStickyBookingBar from './marketing/room-detail/RoomStickyBookingBar';

interface RoomDetailClientProps {
  room: Room;
}

export default function RoomDetailClient({ room }: RoomDetailClientProps) {
  // Date & counter controls for enquiry booking section
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState(room.id);

  // Calculated stay nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  // Selected room object
  const activeBookingRoom = useMemo(() => {
    return ROOMS_DATA.find((r) => r.id === selectedRoomId) || room;
  }, [selectedRoomId, room]);

  // Estimated total
  const estimatedTotal = useMemo(() => {
    return activeBookingRoom.priceNpr * nights;
  }, [activeBookingRoom, nights]);

  // Related rooms (excluding current room)
  const relatedRooms = useMemo(() => {
    return ROOMS_DATA.filter((r) => r.id !== room.id && r.slug !== room.slug).slice(0, 3);
  }, [room]);

  // Gallery images list
  const allImages = useMemo(() => {
    const imagesSet = new Set<string>();
    if (room.image) imagesSet.add(room.image);
    if (room.galleryImages && room.galleryImages.length > 0) {
      room.galleryImages.forEach((img) => imagesSet.add(img));
    }
    return Array.from(imagesSet);
  }, [room]);

  const scrollToEnquiry = () => {
    const el = document.getElementById('enquiry-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-brand-charcoal selection:bg-brand-green selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* 1. ROOM HERO HEADER */}
        <RoomDetailHero room={room} />

        {/* 2. ROOM TITLE & PRICE HEADER */}
        <RoomDetailHeader room={room} />

        {/* 3. SPOTLIGHT CAROUSEL & LIGHTBOX */}
        <RoomSpotlightGallery room={room} allImages={allImages} />

        {/* 4. ROOM DETAILS & AMENITIES */}
        <section className="py-12 sm:py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT: About Room & Amenities */}
            <div className="lg:col-span-8">
              <RoomAmenitiesSection room={room} />
            </div>

            {/* RIGHT: Desktop Sticky Sidebar & Mobile Bottom Bar */}
            <RoomStickyBookingBar
              room={room}
              todayStr={todayStr}
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
              nights={nights}
              estimatedTotal={estimatedTotal}
              onScrollToEnquiry={scrollToEnquiry}
            />
          </div>
        </section>

        {/* 5. WHAT TO EXPECT SECTION */}
        <WhatToExpectSection />

        {/* 6. ENQUIRY FOR ROOM BOOKING */}
        <RoomEnquirySection
          room={room}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          adultsCount={adultsCount}
          setAdultsCount={setAdultsCount}
          childrenCount={childrenCount}
          setChildrenCount={setChildrenCount}
          todayStr={todayStr}
          nights={nights}
          activeBookingRoom={activeBookingRoom}
          estimatedTotal={estimatedTotal}
        />

        {/* 7. RELATED ROOMS */}
        {relatedRooms.length > 0 && (
          <section className="py-12 sm:py-16 border-t border-brand-border bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal">
                  You may also like
                </h2>
                <p className="text-stone-600 text-sm sm:text-base">
                  Explore other clean, comfortable room options available at Motimahal Lodge.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedRooms.map((relRoom) => (
                  <RoomCard key={relRoom.id} room={relRoom} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* REUSABLE BOOKING CTA SECTION WITH BACKS.PNG TEXTURE */}
        <CtaSection
          title="Planning Your Stay at Motimahal Lodge?"
          description="Book directly with Motimahal Lodge for guaranteed rates, solar hot water, and authentic tandoori dining in Chitwan."
          buttonText="Check Availability & Enquire"
          buttonHref="#enquiry-section"
          bgTexture={true}
        />
      </main>

      <Footer />
    </div>
  );
}
