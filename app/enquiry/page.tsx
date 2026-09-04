'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { ROOMS_DATA } from '@/lib/data';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function EnquiryPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [roomId, setRoomId] = useState(ROOMS_DATA[0].id);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState('2 Guests');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'bank' | 'hotel'>('esewa');
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const currentRoom = ROOMS_DATA.find((r) => r.id === roomId) || ROOMS_DATA[0];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col text-[#2D2B2A]"
      style={{
        backgroundImage: "url('/textures/backs.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Check Availability & Enquire"
          subtitle="Tell us your intended stay dates and preferences. Our desk team will verify room availability and confirm with you directly."
          breadcrumbs={[{ label: 'Check Availability' }]}
        />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 sm:p-10 rounded-lg border border-[#E6DFD5] shadow-xs">

              {confirmed ? (
                <div className="text-center space-y-4 py-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-[#1F3A2B]">
                    Enquiry Received
                  </h3>
                  <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                    Thanks {guestName} — your stay enquiry for <strong>{currentRoom.name}</strong> has been received. We’ll get back to you with availability and details via {phone}.
                  </p>

                  <div className="bg-[#FAF7F2] p-4 rounded border border-[#E6DFD5] text-left max-w-md mx-auto space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#E6DFD5] pb-2">
                      <span className="text-stone-500">Accommodation:</span>
                      <span className="font-semibold text-stone-900">{currentRoom.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E6DFD5] pb-2">
                      <span className="text-stone-500">Dates:</span>
                      <span className="text-stone-900">{checkIn || '12:00 PM'} to {checkOut || '11:00 AM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Payment Selection:</span>
                      <span className="font-bold text-stone-900 uppercase">{paymentMethod}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setConfirmed(false);
                        setStep(1);
                      }}
                      className="bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-xs py-2.5 px-6 rounded transition-colors"
                    >
                      Make Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {step === 1 ? (
                    <form onSubmit={handleNextStep} className="space-y-5">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-[#1F3A2B] mb-1">
                          1. Stay Details
                        </h3>
                        <p className="text-xs text-stone-500">Select your room preference and intended arrival/departure dates.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Room Preference *</label>
                        <select
                          value={roomId}
                          onChange={(e) => setRoomId(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                        >
                          {ROOMS_DATA.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} — NPR {r.priceNpr.toLocaleString()} / night
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Check-In Date *</label>
                          <input
                            type="date"
                            required
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-[#1F3A2B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Check-Out Date *</label>
                          <input
                            type="date"
                            required
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-[#1F3A2B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Number of Guests</label>
                        <select
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                        >
                          <option value="1 Guest">1 Guest</option>
                          <option value="2 Guests">2 Guests</option>
                          <option value="3 Guests">3 Guests</option>
                          <option value="4 Guests">4+ Guests</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#9E4B27] hover:bg-[#853C1D] text-white font-semibold text-xs py-3.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Continue to Guest Info</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmitEnquiry} className="space-y-5">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-[#1F3A2B] mb-1">
                          2. Guest Information
                        </h3>
                        <p className="text-xs text-stone-500">Provide your contact info so our front desk can confirm with you.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Prashant Sapkota"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-[#1F3A2B]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+977 98XXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-[#1F3A2B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-[#1F3A2B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method Preference</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#1F3A2B]"
                        >
                          <option value="esewa">eSewa Mobile Wallet</option>
                          <option value="bank">Direct Bank Transfer</option>
                          <option value="hotel">Pay at Hotel Desk</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Special Requests or Questions</label>
                        <textarea
                          rows={3}
                          placeholder="Airport pickup, arrival time, or safari excursion inquiry..."
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded p-3 text-xs focus:outline-none focus:border-[#1F3A2B]"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs font-semibold text-stone-600 hover:text-[#1F3A2B]"
                        >
                          ← Back to Stay Details
                        </button>

                        <button
                          type="submit"
                          className="bg-[#9E4B27] hover:bg-[#853C1D] text-white font-semibold text-xs py-3.5 px-6 rounded transition-colors cursor-pointer"
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
