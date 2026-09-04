'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { ROOMS_DATA } from '@/lib/data';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoomId?: string;
}

export default function BookingModal({ isOpen, onClose, selectedRoomId }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [roomId, setRoomId] = useState(selectedRoomId || ROOMS_DATA[0].id);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState('2 Guests');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'bank' | 'hotel'>('esewa');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const currentRoom = ROOMS_DATA.find((r) => r.id === roomId) || ROOMS_DATA[0];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  const handleReset = () => {
    setConfirmed(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 sm:p-8 relative border border-[#E6DFD5] shadow-xl max-h-[90vh] overflow-y-auto text-[#2D2B2A]">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors p-1"
        >
          <X className="h-6 w-6" />
        </button>

        {confirmed ? (
          <div className="text-center space-y-4 py-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A2B]">
              Enquiry Received
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed max-w-xs mx-auto font-normal">
              Thanks {guestName} — your stay enquiry for <strong>{currentRoom.name}</strong> has been received. We’ll get back to you shortly on {phone} with availability and details.
            </p>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="bg-[#1F3A2B] text-white font-semibold text-xs sm:text-sm py-3 px-8 rounded-md hover:bg-[#162B20] transition-colors cursor-pointer uppercase tracking-wider"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="border-b border-[#E6DFD5] pb-4 mb-6">
              <span className="text-xs font-semibold text-[#1F3A2B] uppercase tracking-wider block">
                Motimahal Lodge Accommodation
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A2B]">
                Check Availability & Enquire
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Tell us your intended dates and preferences. No upfront payment required to submit an enquiry.
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Room Preference *</label>
                  <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md px-3 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                  >
                    {ROOMS_DATA.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — NPR {r.priceNpr.toLocaleString()} / night
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Arrival Date *</label>
                    <input
                      type="date"
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1F3A2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Departure Date *</label>
                    <input
                      type="date"
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1F3A2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Number of Guests</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md px-3 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3 Guests">3 Guests</option>
                    <option value="4 Guests">4+ Guests</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-xs sm:text-sm py-3.5 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 tracking-wider"
                  >
                    <span>Continue to Contact Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prashant Sapkota"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1F3A2B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+977 98XXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1F3A2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1F3A2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Payment / Stay Preference</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md px-3 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                  >
                    <option value="esewa">Pay via eSewa</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="hotel">Pay at Hotel Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Additional Notes / Special Requests</label>
                  <textarea
                    rows={2}
                    placeholder="Airport pickup, arrival time, or safari trip inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded-md p-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1F3A2B]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs sm:text-sm text-stone-600 hover:text-[#1F3A2B] font-medium"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    className="bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-xs sm:text-sm py-3 px-6 rounded-md transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Send Stay Enquiry
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
