'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Check, Calendar, Users, Mail, Phone, User, AlertTriangle } from 'lucide-react';

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
        <h2 className="text-title-section mb-4">Room Type Not Found</h2>
        <Link href="/" className="btn-luxury-link">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 bg-background">
      {/* Back Button */}
      <Link 
        href="/rooms" 
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to our rooms
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Carousel & Room Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Main Gallery */}
          <div className="relative h-[450px] w-full bg-muted-light rounded-[2rem] overflow-hidden border border-border shadow-md">
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
                  className={`relative h-20 w-28 rounded-2xl overflow-hidden border-2 transition-all ${
                    activePhoto === i ? 'border-primary-accent shadow-sm' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={photo} alt="" fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="border-b border-border pb-8">
            <h1 className="text-title-section mb-3">{roomType.name}</h1>
            <p className="text-primary font-bold text-xl">NPR {roomType.price.toLocaleString()} <span className="text-sm font-normal text-muted">/ night</span></p>
            <div className="editorial-line"></div>
            <p className="text-sm sm:text-base text-muted mt-6 leading-relaxed">{roomType.description}</p>
          </div>

          {/* Amenities checklist */}
          <div>
            <h2 className="text-title-card mb-6">What is included in this room</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomType.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-primary-light text-primary border border-primary-accent/25">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium text-foreground">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
            
            {/* Header Availability Alert */}
            <div className={`alert-luxury ${
              isAvailable ? 'alert-luxury-success' : 'alert-luxury-danger'
            }`}>
              <div className="mt-0.5 shrink-0">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-micro">{isAvailable ? 'Room is Available!' : 'Sold Out for these dates'}</p>
                <p className="opacity-90 mt-1 leading-normal">
                  {isAvailable 
                    ? `We have ${unitsLeft} room${unitsLeft > 1 ? 's' : ''} available for these dates.`
                    : 'Please try selecting another date range or check our other rooms.'}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="input-luxury-container">
                  <label className="input-luxury-label">
                    <Calendar className="h-3 w-3 text-primary-accent" /> Check-in
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
                    className="input-luxury-field"
                    required
                  />
                </div>

                <div className="input-luxury-container">
                  <label className="input-luxury-label">
                    <Calendar className="h-3 w-3 text-primary-accent" /> Check-out
                  </label>
                  <input 
                    type="date" 
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="input-luxury-field"
                    required
                  />
                </div>
              </div>

              <div className="input-luxury-container">
                <label className="input-luxury-label">
                  <Users className="h-3 w-3 text-primary-accent" /> Guests
                </label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="input-luxury-field cursor-pointer"
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
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-1">Guest Information</h3>
                
                <div className="input-luxury-container">
                  <label className="input-luxury-label">
                    <User className="h-3.5 w-3.5 text-primary-accent" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Anil Gurung"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-luxury-field"
                    required
                  />
                </div>

                <div className="input-luxury-container">
                  <label className="input-luxury-label">
                    <Phone className="h-3.5 w-3.5 text-primary-accent" /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-luxury-field"
                    required
                  />
                </div>

                <div className="input-luxury-container">
                  <label className="input-luxury-label">
                    <Mail className="h-3.5 w-3.5 text-primary-accent" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="anil@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-luxury-field"
                    required
                  />
                </div>

                <div className="input-luxury-container">
                  <label className="input-luxury-label">Special Requests / Message</label>
                  <textarea 
                    placeholder="Let us know if you need pick-up from Bharatpur Airport or Narayanghat station, early check-in, or have dietary preferences."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="input-luxury-field resize-none h-12"
                  />
                </div>
              </div>

              {/* Pricing breakdown */}
              {isAvailable && (
                <div className="bg-muted-light p-4 rounded-2xl flex flex-col gap-2.5 text-xs text-muted border border-border/60 mt-2">
                  <div className="flex justify-between">
                    <span>NPR {roomType.price.toLocaleString()} x {nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="font-bold text-foreground">NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotel Service Charge (10%)</span>
                    <span className="font-bold text-foreground">NPR {serviceCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (13%)</span>
                    <span className="font-bold text-foreground">NPR {vat.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-border/80 my-1"></div>
                  <div className="flex justify-between text-sm text-foreground font-bold">
                    <span>Total Booking Cost</span>
                    <span className="text-primary font-bold text-base">NPR {total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button 
                type="submit"
                disabled={!isAvailable}
                className="btn-luxury-primary w-full mt-2"
              >
                <span>Request Room Booking</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
