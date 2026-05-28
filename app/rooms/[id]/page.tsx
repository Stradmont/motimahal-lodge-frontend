'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Check, Calendar, Users, Coffee, Mail, Phone, User, AlertTriangle } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RoomDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { roomTypes, checkAvailability, getAvailableCount, createBooking, isLoaded } = useApp();

  // Extract query params for prefilled dates
  const queryCheckIn = searchParams.get('checkIn') || '';
  const queryCheckOut = searchParams.get('checkOut') || '';
  const queryGuests = searchParams.get('guests') || '2';

  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Form states
  const [checkIn, setCheckIn] = useState(queryCheckIn || getTodayStr());
  const [checkOut, setCheckOut] = useState(queryCheckOut || getTomorrowStr());
  const [guests, setGuests] = useState(Number(queryGuests));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);

  // Find current room type
  const roomType = roomTypes.find(rt => rt.id === roomId);

  if (isLoaded && !roomType) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Room Type Not Found</h2>
        <Link href="/" className="text-primary hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate pricing & availability
  const isAvailable = checkAvailability(roomType.id, checkIn, checkOut);
  const unitsLeft = getAvailableCount(roomType.id, checkIn, checkOut);
  
  const getNumNights = () => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    if (isNaN(diffTime) || diffTime <= 0) return 1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = getNumNights();
  const subtotal = roomType.price * nights;
  const vat = Math.round(subtotal * 0.13); // 13% Nepali VAT
  const serviceCharge = Math.round(subtotal * 0.10); // 10% Service Charge
  const total = subtotal + vat + serviceCharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) {
      alert('This room is no longer available for the selected dates.');
      return;
    }

    const booking = createBooking({
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
      roomTypeId: roomType.id,
      checkIn,
      checkOut,
      numGuests: guests,
      notes
    });

    router.push(`/booking/confirm/${booking.referenceNumber}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to accommodations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Carousel & Room Info */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Gallery */}
          <div className="relative h-96 w-full bg-muted-light rounded-3xl overflow-hidden border border-border">
            <Image 
              src={roomType.photos[activePhoto] || roomType.photos[0]} 
              alt={roomType.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
          
          {/* Thumbnail triggers */}
          {roomType.photos.length > 1 && (
            <div className="flex gap-3">
              {roomType.photos.map((photo, i) => (
                <button 
                  key={i} 
                  onClick={() => setActivePhoto(i)}
                  className={`relative h-20 w-28 rounded-xl overflow-hidden border-2 transition-all ${
                    activePhoto === i ? 'border-primary' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={photo} alt="" fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="border-b border-border pb-6">
            <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">{roomType.name}</h1>
            <p className="text-primary font-semibold text-lg">NPR {roomType.price.toLocaleString()} / night</p>
            <p className="text-sm text-muted mt-4 leading-relaxed">{roomType.description}</p>
          </div>

          {/* Amenities checklist */}
          <div>
            <h2 className="text-xl font-medium text-foreground mb-4">What this room offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roomType.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-primary border border-primary-accent/40">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
            
            {/* Header Availability Alert */}
            <div className={`p-4 rounded-2xl flex gap-3 text-xs leading-relaxed border ${
              isAvailable 
                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-800 dark:text-red-300 border-red-500/20'
            }`}>
              <div className="mt-0.5">
                <AlertTriangle className={`h-4 w-4 ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`} />
              </div>
              <div>
                <p className="font-semibold">{isAvailable ? 'Room is Available!' : 'Sold Out for these dates'}</p>
                <p className="opacity-90 mt-0.5">
                  {isAvailable 
                    ? `We currently have ${unitsLeft} unit${unitsLeft > 1 ? 's' : ''} of ${roomType.name} left.`
                    : 'Please select another date range or try standard/normal rooms.'}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Check-in
                  </label>
                  <input 
                    type="date" 
                    value={checkIn}
                    min={getTodayStr()}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (new Date(e.target.value) >= new Date(checkOut)) {
                        const nextDay = new Date(e.target.value);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOut(nextDay.toISOString().split('T')[0]);
                      }
                    }}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-sm font-medium text-foreground w-full"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Check-out
                  </label>
                  <input 
                    type="date" 
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-sm font-medium text-foreground w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" /> Guests
                </label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-sm font-medium text-foreground w-full cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>

              <div className="h-px bg-border my-2"></div>

              {/* Guest Details */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Guest Information</h3>
                
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted/60" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground w-full"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted/60" />
                  <input 
                    type="tel" 
                    placeholder="Phone Number (e.g. 98XXXXXXXX)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground w-full"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted/60" />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground w-full"
                    required
                  />
                </div>

                <textarea 
                  placeholder="Special requests (e.g. twin beds, early check-in, dietary preferences)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-4 py-2.5 text-sm text-foreground w-full resize-none"
                />
              </div>

              {/* Pricing breakdown */}
              {isAvailable && (
                <div className="bg-muted-light p-4 rounded-2xl flex flex-col gap-2 text-xs text-muted border border-border/60 mt-2">
                  <div className="flex justify-between">
                    <span>NPR {roomType.price.toLocaleString()} x {nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="font-medium text-foreground">NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotel Service Charge (10%)</span>
                    <span className="font-medium text-foreground">NPR {serviceCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (13%)</span>
                    <span className="font-medium text-foreground">NPR {vat.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-border/80 my-1"></div>
                  <div className="flex justify-between text-sm text-foreground font-semibold">
                    <span>Total Amount</span>
                    <span className="text-primary font-bold">NPR {total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button 
                type="submit"
                disabled={!isAvailable}
                className="w-full bg-primary disabled:bg-muted disabled:cursor-not-allowed hover:bg-primary/95 text-primary-light py-3 rounded-xl font-medium text-sm transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <span>Reserve Room</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
