'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users, BedDouble, Search } from 'lucide-react';
import BookingModal from './BookingModal';

export default function AvailabilityBar() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Guests');
  const [roomCategory, setRoomCategory] = useState('All Categories');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingModalOpen(true);
  };

  return (
    <>
      <div className="w-full bg-[#162B20] text-white p-4 sm:p-6 rounded-lg shadow-xl border border-[#2D4D3B]">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          
          {/* Check-In */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-[#C88A3B]" />
              Check-In Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-[#1F3A2B] border border-[#2D4D3B] text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-[#C88A3B]"
              required
            />
          </div>

          {/* Check-Out */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-[#C88A3B]" />
              Check-Out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#1F3A2B] border border-[#2D4D3B] text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-[#C88A3B]"
              required
            />
          </div>

          {/* Guests */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#C88A3B]" />
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-[#1F3A2B] border border-[#2D4D3B] text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-[#C88A3B]"
            >
              <option value="1 Guest">1 Guest (Solo)</option>
              <option value="2 Guests">2 Guests (Couple / Pair)</option>
              <option value="3 Guests">3 Guests</option>
              <option value="4 Guests">4+ Guests (Family)</option>
            </select>
          </div>

          {/* Room Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-[#C88A3B]" />
              Room Type
            </label>
            <select
              value={roomCategory}
              onChange={(e) => setRoomCategory(e.target.value)}
              className="w-full bg-[#1F3A2B] border border-[#2D4D3B] text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-[#C88A3B]"
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
              className="w-full bg-[#9E4B27] hover:bg-[#853C1D] text-white font-semibold text-xs uppercase tracking-wider py-3.5 px-4 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Search className="h-4 w-4" />
              <span>Check Availability</span>
            </button>
          </div>

        </form>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </>
  );
}
