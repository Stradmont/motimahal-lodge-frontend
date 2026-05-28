'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import { Calendar, Users, Shield, Award, CheckCircle2, ChevronRight, Moon, Utensils, HelpCircle } from 'lucide-react';

export default function Home() {
  const { roomTypes, checkAvailability, getAvailableCount, isLoaded } = useApp();
  
  // Set defaults: check-in is today, check-out is tomorrow
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(getTodayStr());
  const [checkOut, setCheckOut] = useState(getTomorrowStr());
  const [guests, setGuests] = useState('2');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero text-primary-light py-20 lg:py-28 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Image tint */}
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative max-w-4xl z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light/10 text-primary-accent text-xs font-medium tracking-wide uppercase border border-primary-accent/20 mb-6">
            <Award className="h-3 w-3" /> Chitwan's Premier Eco-Lodge
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-6 leading-tight">
            Experience the Wild in <br />
            <span className="text-primary-accent font-semibold">Premium Comfort</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Nestled on the edge of Chitwan National Park, Motimahal Lodge blends rustic nature vibes with premium hospitality. Book your stay and enjoy clean spaces, authentic dining, and direct in-room service.
          </p>

          {/* Booking Bar Widget */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-3xl bg-card border border-border text-foreground p-4 sm:p-5 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 text-left"
          >
            <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="flex-1 min-w-[140px] px-3 py-1.5 rounded-xl hover:bg-muted-light transition-colors">
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted mb-0.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" /> Check-In
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
                  className="w-full bg-transparent text-sm focus:outline-none font-medium border-0 p-0 text-foreground"
                  required
                />
              </div>
              
              <div className="h-px sm:h-8 w-full sm:w-px bg-border my-1 sm:my-0"></div>

              <div className="flex-1 min-w-[140px] px-3 py-1.5 rounded-xl hover:bg-muted-light transition-colors">
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted mb-0.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" /> Check-Out
                </label>
                <input 
                  type="date" 
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none font-medium border-0 p-0 text-foreground"
                  required
                />
              </div>

              <div className="h-px sm:h-8 w-full sm:w-px bg-border my-1 sm:my-0"></div>

              <div className="flex-1 min-w-[100px] px-3 py-1.5 rounded-xl hover:bg-muted-light transition-colors">
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted mb-0.5 flex items-center gap-1">
                  <Users className="h-3 w-3 text-primary" /> Guests
                </label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none font-medium border-0 p-0 text-foreground cursor-pointer"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-light px-8 py-3 rounded-xl sm:rounded-full font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
            >
              <span>Check Rooms</span>
            </button>
          </form>
        </div>
      </section>

      {/* Main Room Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-medium tracking-wider text-primary">Accommodations</span>
            <h2 className="text-3xl font-medium tracking-tight mt-1 text-foreground">Our Cozy Rooms</h2>
          </div>
          {hasSearched && (
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-primary-light text-primary border border-primary-accent/40 px-4 py-2 rounded-xl text-sm">
              <span>Showing availability from <strong>{checkIn}</strong> to <strong>{checkOut}</strong></span>
              <button 
                onClick={() => setHasSearched(false)} 
                className="underline hover:text-foreground font-medium text-xs ml-2"
              >
                Clear Dates
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoaded && roomTypes.map((room) => {
            const isAvailable = checkAvailability(room.id, checkIn, checkOut);
            const availableUnits = getAvailableCount(room.id, checkIn, checkOut);
            
            return (
              <div 
                key={room.id} 
                className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden hover-lift"
              >
                {/* Photo Header */}
                <div className="relative h-64 w-full bg-muted-light overflow-hidden">
                  <Image 
                    src={room.photos[0]} 
                    alt={room.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-primary border border-border">
                    NPR {room.price.toLocaleString()} / night
                  </div>
                  
                  {/* Availability Badge */}
                  {hasSearched && (
                    <div className={`absolute bottom-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border ${
                      isAvailable 
                        ? 'bg-emerald-500/90 text-white border-emerald-400' 
                        : 'bg-red-500/90 text-white border-red-400'
                    }`}>
                      {isAvailable ? `${availableUnits} Unit${availableUnits > 1 ? 's' : ''} Left` : 'Sold Out'}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-foreground group-hover:text-primary transition-colors">{room.name}</h3>
                    <p className="text-sm text-muted mb-6 line-clamp-3 leading-relaxed">{room.description}</p>
                    
                    {/* Amenities list (brief limit 4) */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-muted-light text-muted border border-border/50">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-xs px-2.5 py-1 rounded-md text-primary font-medium">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <Link 
                    href={`/rooms/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                    className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-primary text-primary hover:bg-primary hover:text-primary-light font-medium text-sm transition-all"
                  >
                    <span>View Room & Book</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experiences & Portal Segment */}
      <section className="bg-muted-light border-y border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-light">
              <Shield className="h-6 w-6" />
            </span>
            <div>
              <h4 className="text-lg font-medium text-foreground mb-2">Secure Booking</h4>
              <p className="text-sm text-muted leading-relaxed">Unique reference tokens (MM-2026-XXXX) protect your reservations. Confirmed instantly over SMS and verification screens.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-light">
              <Utensils className="h-6 w-6" />
            </span>
            <div>
              <h4 className="text-lg font-medium text-foreground mb-2">In-Room Dining</h4>
              <p className="text-sm text-muted leading-relaxed">Scan QR codes or enter your booking code to view our kitchen menu. Fresh Chicken Momos and local Thakali sets delivered hot to your door.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-light">
              <Moon className="h-6 w-6" />
            </span>
            <div>
              <h4 className="text-lg font-medium text-foreground mb-2">Authentic Chitwan</h4>
              <p className="text-sm text-muted leading-relaxed">Located in Sauraha, a stone's throw from jungle safaris, bird watching, and elephant rides. Return to comfortable sheets and cool nights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hero text-muted-light/60 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs border-t border-primary-accent/15">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-muted">
          <div className="flex flex-col sm:items-start text-center sm:text-left gap-1">
            <span className="font-semibold text-primary-light text-sm">Motimahal Lodge</span>
            <span>Sauraha, Chitwan, Nepal</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/portal" className="hover:text-primary-light transition-colors">Guest Login</Link>
            <Link href="/admin" className="hover:text-primary-light transition-colors">Staff Admin</Link>
            <Link href="/kitchen" className="hover:text-primary-light transition-colors">Kitchen Board</Link>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} Motimahal Lodge. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
