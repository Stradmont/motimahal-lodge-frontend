'use client';

import React, { useState } from 'react';
import { Room, ROOMS_DATA } from '@/lib/data';
import { Phone, Mail, Minus, Plus, CheckCircle2, MessageSquare, Send } from 'lucide-react';

interface RoomEnquirySectionProps {
  room: Room;
  selectedRoomId: string;
  setSelectedRoomId: (id: string) => void;
  checkIn: string;
  setCheckIn: (d: string) => void;
  checkOut: string;
  setCheckOut: (d: string) => void;
  adultsCount: number;
  setAdultsCount: React.Dispatch<React.SetStateAction<number>>;
  childrenCount: number;
  setChildrenCount: React.Dispatch<React.SetStateAction<number>>;
  todayStr: string;
  nights: number;
  activeBookingRoom: Room;
  estimatedTotal: number;
}

export default function RoomEnquirySection({
  room,
  selectedRoomId,
  setSelectedRoomId,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  adultsCount,
  setAdultsCount,
  childrenCount,
  setChildrenCount,
  todayStr,
  nights,
  activeBookingRoom,
  estimatedTotal,
}: RoomEnquirySectionProps) {
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Motimahal Lodge,\nI would like to enquire about booking a stay:\n\n` +
    `• Name: ${fullName || 'Guest'}\n` +
    `• WhatsApp / Phone: ${whatsappNumber || 'N/A'}\n` +
    `• Room Type: ${activeBookingRoom.name}\n` +
    `• Check-in Date: ${checkIn}\n` +
    `• Check-out Date: ${checkOut} (${nights} ${nights === 1 ? 'night' : 'nights'})\n` +
    `• Guests: ${adultsCount} Adults, ${childrenCount} Children\n` +
    `• Estimated Total: NPR ${estimatedTotal.toLocaleString()}`
  );

  const whatsappUrl = `https://wa.me/9779855012345?text=${whatsappMessage}`;

  return (
    <section
      id="enquiry-section"
      className="py-16 sm:py-24 border-t border-b border-[#E6DFD5] relative text-[#2D2B2A]"
      style={{
        backgroundImage: "url('/backs-2.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT COLUMN: ENQUIRY CONTACT DETAILS */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#2D2B2A] leading-tight">
                Enquiry for room booking
              </h2>
              <p className="text-stone-800 text-base sm:text-lg leading-relaxed">
                Have questions or planning a custom stay in Chitwan? Contact our family desk directly for direct bookings and safari assistance.
              </p>
            </div>

            {/* Phone Contact Block */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1F3A2B]/10 border border-[#1F3A2B]/20 flex items-center justify-center text-[#1F3A2B] shrink-0">
                <Phone className="h-7 w-7 text-[#1F3A2B]" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-stone-600 block">
                  Info & Bookings
                </span>
                <a
                  href="tel:+9779855012345"
                  className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A2B] hover:underline block"
                >
                  +977 98550 12345
                </a>
              </div>
            </div>

            {/* WhatsApp Contact Block */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shrink-0">
                <MessageSquare className="h-7 w-7 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-stone-600 block">
                  WhatsApp Instant Desk
                </span>
                <a
                  href="https://wa.me/9779855012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xl sm:text-2xl font-bold text-emerald-800 hover:underline block"
                >
                  +977 98550 12345
                </a>
              </div>
            </div>

            {/* Email Contact Block */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1F3A2B]/10 border border-[#1F3A2B]/20 flex items-center justify-center text-[#1F3A2B] shrink-0">
                <Mail className="h-7 w-7 text-[#1F3A2B]" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-stone-600 block">
                  Info & Bookings Email
                </span>
                <a
                  href="mailto:motimahallodge@gmail.com"
                  className="font-heading text-xl sm:text-2xl font-bold text-[#1F3A2B] hover:underline block"
                >
                  motimahallodge@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE BOOKING WIDGET */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-2xl border border-[#E6DFD5] shadow-xl space-y-6">
            {submitted ? (
              <div className="py-8 px-6 text-center space-y-5 bg-[#FAF7F2] rounded-xl border border-[#E6DFD5]">
                <div className="w-16 h-16 bg-[#1F3A2B]/10 text-[#1F3A2B] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-[#1F3A2B]" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#2D2B2A]">
                  Enquiry Submitted Successfully!
                </h3>
                <p className="text-stone-700 text-base max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>! We have received your booking enquiry for <strong>{activeBookingRoom.name}</strong> ({checkIn} to {checkOut}).
                </p>

                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>Send details via WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-sm font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name & WhatsApp Number Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Full name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ram Bahadur Shrestha"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">WhatsApp / Phone number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +977 98550 12345"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                      required
                    />
                  </div>
                </div>

                {/* Date Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Check-in date</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Check-out date</label>
                    <input
                      type="date"
                      min={checkIn || todayStr}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                      required
                    />
                  </div>
                </div>

                {/* Room Select Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1.5">Select Room</label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                  >
                    {ROOMS_DATA.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — NPR {r.priceNpr.toLocaleString()} / night
                      </option>
                    ))}
                  </select>
                </div>

                {/* Adults / Childs Counters */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Adults</label>
                    <div className="flex items-center justify-between bg-[#FAF7F2] border border-[#E6DFD5] rounded-lg px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setAdultsCount((prev) => Math.max(1, prev - 1))}
                        className="p-1 hover:text-[#1F3A2B] cursor-pointer"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="font-semibold text-base">{adultsCount}</span>
                      <button
                        type="button"
                        onClick={() => setAdultsCount((prev) => prev + 1)}
                        className="p-1 hover:text-[#1F3A2B] cursor-pointer"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Childs</label>
                    <div className="flex items-center justify-between bg-[#FAF7F2] border border-[#E6DFD5] rounded-lg px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                        className="p-1 hover:text-[#1F3A2B] cursor-pointer"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="font-semibold text-base">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => prev + 1)}
                        className="p-1 hover:text-[#1F3A2B] cursor-pointer"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimated Price Summary */}
                <div className="bg-[#FAF7F2] p-5 rounded-lg border border-[#E6DFD5] flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm text-stone-700 font-semibold block">
                      {activeBookingRoom.name}
                    </span>
                    <span className="text-sm text-stone-600">
                      NPR {activeBookingRoom.priceNpr.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500 font-medium block">Total</span>
                    <span className="font-heading text-2xl font-bold text-[#1F3A2B]">
                      NPR {estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Book Now Button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm py-3 px-6 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>WhatsApp Enquiry</span>
                  </a>

                  <button
                    type="submit"
                    className="bg-white hover:bg-stone-100 text-[#2D2B2A] border-2 border-[#2D2B2A] font-semibold text-base py-3 px-8 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
