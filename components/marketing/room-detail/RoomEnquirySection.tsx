'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Room, ROOMS_DATA } from '@/lib/data';
import { useContactSettings } from '@/lib/contact-settings';
import { Phone, Mail, Minus, Plus, CheckCircle2, MessageSquare, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Full name must be at least 2 characters' }),
  whatsappNumber: z
    .string()
    .trim()
    .min(1, { message: 'Phone or WhatsApp number is required' })
    .min(7, { message: 'Please enter a valid phone or WhatsApp number (min 7 digits)' }),
  checkIn: z.string().trim().min(1, { message: 'Check-in date is required' }),
  checkOut: z.string().trim().min(1, { message: 'Check-out date is required' }),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

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
  const contact = useContactSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; whatsapp: string }>({ name: '', whatsapp: '' });
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoomDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: '',
      whatsappNumber: '',
      checkIn: checkIn || todayStr,
      checkOut: checkOut || todayStr,
    },
    mode: 'onBlur',
  });

  const onEnquirySubmit = (data: EnquiryFormData) => {
    setSubmittedData({ name: data.fullName, whatsapp: data.whatsappNumber });
    setCheckIn(data.checkIn);
    setCheckOut(data.checkOut);
    setSubmitted(true);
  };

  const whatsappCleanNumber = contact.whatsappNumber.replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Hello Motimahal Lodge,\nI would like to enquire about booking a stay:\n\n` +
    `• Name: ${submittedData.name || 'Guest'}\n` +
    `• WhatsApp / Phone: ${submittedData.whatsapp || 'N/A'}\n` +
    `• Room Type: ${activeBookingRoom.name}\n` +
    `• Check-in Date: ${checkIn}\n` +
    `• Check-out Date: ${checkOut} (${nights} ${nights === 1 ? 'night' : 'nights'})\n` +
    `• Guests: ${adultsCount} Adults, ${childrenCount} Children\n` +
    `• Estimated Total: NPR ${estimatedTotal.toLocaleString()}`
  );

  const whatsappUrl = `https://wa.me/${whatsappCleanNumber}?text=${whatsappMessage}`;

  return (
    <section
      id="enquiry-section"
      className="py-16 sm:py-24 border-t border-b border-brand-border relative text-brand-charcoal bg-texture scroll-mt-20 sm:scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT COLUMN: ENQUIRY CONTACT DETAILS */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-brand-charcoal leading-tight">
                Enquiry for room booking
              </h2>
              <p className="text-stone-800 text-base sm:text-lg leading-relaxed">
                Have questions or planning a custom stay in Chitwan? Contact our family desk directly for direct bookings and safari assistance.
              </p>
            </div>

            {/* Phone Contact Block */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                <Phone className="h-7 w-7 text-brand-green" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-stone-600 block">
                  Info & Bookings
                </span>
                <a
                  href={`tel:${contact.primaryPhone.replace(/\s+/g, '')}`}
                  className="font-heading text-2xl sm:text-3xl font-bold text-brand-green hover:underline block"
                >
                  {contact.primaryPhone}
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
                  href={`https://wa.me/${whatsappCleanNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xl sm:text-2xl font-bold text-emerald-800 hover:underline block"
                >
                  {contact.whatsappNumber}
                </a>
              </div>
            </div>

            {/* Email Contact Block */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                <Mail className="h-7 w-7 text-brand-green" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-stone-600 block">
                  Info & Bookings Email
                </span>
                <a
                  href={`mailto:${contact.inquiryEmail || contact.email}`}
                  className="font-heading text-xl sm:text-2xl font-bold text-brand-green hover:underline block"
                >
                  {contact.inquiryEmail || contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE BOOKING WIDGET */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-2xl border border-brand-border shadow-xl space-y-6">
            {submitted ? (
              <div className="py-8 px-6 text-center space-y-5 bg-brand-surface rounded-xl border border-brand-border">
                <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-brand-green" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-brand-charcoal">
                  Enquiry Submitted Successfully!
                </h3>
                <p className="text-stone-700 text-base max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{submittedData.name}</strong>! We have received your booking enquiry for <strong>{activeBookingRoom.name}</strong> ({checkIn} to {checkOut}).
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
              <form onSubmit={handleSubmit(onEnquirySubmit)} noValidate className="space-y-5">
                {/* Full Name & WhatsApp Number Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Full name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ram Bahadur Shrestha"
                      {...register('fullName')}
                      className={`w-full bg-brand-surface border ${
                        errors.fullName ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-brand-green'
                      } rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">WhatsApp / Phone number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +977 98550 12345"
                      {...register('whatsappNumber')}
                      className={`w-full bg-brand-surface border ${
                        errors.whatsappNumber ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-brand-green'
                      } rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none`}
                    />
                    {errors.whatsappNumber && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.whatsappNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Check-in date</label>
                    <input
                      type="date"
                      min={todayStr}
                      {...register('checkIn', {
                        onChange: (e) => setCheckIn(e.target.value),
                      })}
                      className={`w-full bg-brand-surface border ${
                        errors.checkIn ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-brand-green'
                      } rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none`}
                    />
                    {errors.checkIn && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.checkIn.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Check-out date</label>
                    <input
                      type="date"
                      min={checkIn || todayStr}
                      {...register('checkOut', {
                        onChange: (e) => setCheckOut(e.target.value),
                      })}
                      className={`w-full bg-brand-surface border ${
                        errors.checkOut ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-brand-green'
                      } rounded-lg px-4 py-3 text-base text-stone-900 focus:outline-none`}
                    />
                    {errors.checkOut && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.checkOut.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Custom Smooth Room Select Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Select Room
                  </label>
                  <button
                    type="button"
                    onClick={() => setRoomDropdownOpen(!roomDropdownOpen)}
                    className="w-full bg-brand-surface border border-brand-border hover:border-brand-green rounded-xl px-4 py-3 text-left shadow-2xs transition-all duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-brand-green/20 cursor-pointer"
                    aria-haspopup="listbox"
                    aria-expanded={roomDropdownOpen}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-brand-border/60 bg-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeBookingRoom.image}
                          alt={activeBookingRoom.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-base sm:text-lg font-bold text-brand-charcoal truncate">
                            {activeBookingRoom.name}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-brand-border text-brand-green">
                            {activeBookingRoom.category}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 font-medium block">
                          NPR {activeBookingRoom.priceNpr.toLocaleString()} / night
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-stone-500 group-hover:text-brand-green transition-transform duration-200 shrink-0 ${
                        roomDropdownOpen ? 'rotate-180 text-brand-green' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Options Floating Menu */}
                  {roomDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-40 mt-2 bg-white rounded-xl border border-brand-border shadow-2xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      {ROOMS_DATA.map((r) => {
                        const isSelected = r.id === selectedRoomId;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setSelectedRoomId(r.id);
                              setRoomDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-brand-surface text-brand-green font-medium'
                                : 'hover:bg-stone-50 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 truncate">
                              <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-brand-border/60 bg-stone-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={r.image}
                                  alt={r.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="truncate">
                                <div className="font-heading text-base font-bold text-brand-charcoal">
                                  {r.name}
                                </div>
                                <div className="text-xs text-stone-500 flex items-center gap-2">
                                  <span>NPR {r.priceNpr.toLocaleString()} / night</span>
                                  <span>•</span>
                                  <span>{r.bedType}</span>
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Adults / Childs Counters */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Adults</label>
                    <div className="flex items-center justify-between bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setAdultsCount((prev) => Math.max(1, prev - 1))}
                        className="p-1 hover:text-brand-green cursor-pointer"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="font-semibold text-base">{adultsCount}</span>
                      <button
                        type="button"
                        onClick={() => setAdultsCount((prev) => prev + 1)}
                        className="p-1 hover:text-brand-green cursor-pointer"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">Childs</label>
                    <div className="flex items-center justify-between bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                        className="p-1 hover:text-brand-green cursor-pointer"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="font-semibold text-base">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => prev + 1)}
                        className="p-1 hover:text-brand-green cursor-pointer"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimated Price Summary */}
                <div className="bg-brand-surface p-5 rounded-lg border border-brand-border flex items-center justify-between">
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
                    <span className="font-heading text-2xl font-bold text-brand-green">
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
                    className="bg-white hover:bg-stone-100 text-brand-charcoal border-2 border-brand-charcoal font-semibold text-base py-3 px-8 rounded-lg shadow-sm transition-all cursor-pointer"
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
