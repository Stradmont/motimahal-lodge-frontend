'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Users, BedDouble, Search } from 'lucide-react';

export default function AvailabilityBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Guests');
  const [roomCategory, setRoomCategory] = useState('All Categories');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/rooms');
  };

  return (
    <div className="w-full bg-brand-green-dark text-white p-4 sm:p-6 rounded-lg shadow-xl border border-footer-border">
      <form onSubmit={handleSearch} noValidate className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        {/* Check-In */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-brand-gold" />
            Check-In Date
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-brand-green border border-footer-border text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-brand-gold"
          />
        </div>

        {/* Check-Out */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-brand-gold" />
            Check-Out Date
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-brand-green border border-footer-border text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-brand-gold"
          />
        </div>

        {/* Guests */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-brand-gold" />
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-brand-green border border-footer-border text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-brand-gold"
          >
            <option value="1 Guest">1 Guest (Solo)</option>
            <option value="2 Guests">2 Guests (Couple / Pair)</option>
            <option value="3 Guests">3 Guests</option>
            <option value="4 Guests">4+ Guests (Family)</option>
          </select>
        </div>

        {/* Room Category */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-brand-gold" />
            Room Type
          </label>
          <select
            value={roomCategory}
            onChange={(e) => setRoomCategory(e.target.value)}
            className="w-full bg-brand-green border border-footer-border text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-brand-gold"
          >
            <option value="All Categories">All Room Types</option>
            <option value="Deluxe">Deluxe AC Garden Room</option>
            <option value="Suite">Family Executive Suite</option>
            <option value="Standard">Standard AC Double Room</option>
          </select>
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-brand-green hover:bg-brand-green-dark border border-footer-border text-white font-semibold text-xs py-3.5 px-4 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Search className="h-4 w-4" />
            <span>Check Availability</span>
          </button>
        </div>
      </form>
    </div>
  );
}
