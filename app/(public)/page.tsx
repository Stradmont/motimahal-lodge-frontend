'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Calendar, Users, CheckCircle2, ChevronRight,
  ArrowRight, Utensils,
} from 'lucide-react';

export default function Home() {
  const { roomTypes, checkAvailability, getAvailableCount, isLoaded, foodItems } = useApp();

  const getTodayStr    = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn]           = useState(getTodayStr);
  const [checkOut, setCheckOut]         = useState(getTomorrowStr);
  const [guests, setGuests]             = useState('2');
  const [hasSearched, setHasSearched]   = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const featuredFood = isLoaded
    ? foodItems.filter((f) => f.isAvailable).slice(0, 6)
    : [];

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground selection:bg-primary-accent/20">

      {/* ─────────────────────────────────────────────────────────
          HERO
          ───────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-28 pb-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left: copy & booking widget */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent">
              ESTABLISHED 2061 B.S. · BHARATPUR
            </span>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-foreground mt-4 mb-6">
              A quiet garden home<br />
              by the Narayani River
            </h1>
            
            <div className="w-12 h-0.5 bg-primary-accent mb-8"></div>
            
            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl font-sans mb-8">
              Namaste. Our journey began in 2061 B.S. with Motimahal Hotel & Tandoori Restaurant,
              built on warm family values and dedication. Today, Motimahal Lodge stands proudly
              beside the Narayani River, offering comfortable stays, peaceful gardens, and
              delicious food just 900 meters away.
            </p>

            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary-accent/80 border-b border-primary-accent/20 pb-1 mb-8">
              अतिथि देवो भव · guest is god
            </span>

            {/* Booking widget - Custom Minimal Styling */}
            <div className="w-full border border-border/80 bg-white p-6 shadow-sm rounded-none max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-4">
                Check Room Availability
              </p>
              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="input-luxury-container rounded-none bg-background/50">
                    <label className="input-luxury-label">
                      <Calendar className="h-3 w-3 text-primary-accent" /> Check-In
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={getTodayStr()}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (new Date(e.target.value) >= new Date(checkOut)) {
                          const next = new Date(e.target.value);
                          next.setDate(next.getDate() + 1);
                          setCheckOut(next.toISOString().split('T')[0]);
                        }
                      }}
                      className="input-luxury-field"
                      required
                    />
                  </div>
                  <div className="input-luxury-container rounded-none bg-background/50">
                    <label className="input-luxury-label">
                      <Calendar className="h-3 w-3 text-primary-accent" /> Check-Out
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
                  <div className="input-luxury-container rounded-none bg-background/50">
                    <label className="input-luxury-label">
                      <Users className="h-3 w-3 text-primary-accent" /> Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="input-luxury-field cursor-pointer"
                    >
                      {['1', '2', '3', '4'].map((n) => (
                        <option key={n} value={n} className="bg-card text-foreground">
                          {n} Guest{n !== '1' ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-luxury-primary rounded-none w-full cursor-pointer">
                  Check Availability <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right: single strong photo with physical framed styling */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative p-3 sm:p-4 bg-white border border-border shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500 max-w-md w-full">
              <div className="relative aspect-[4/5] bg-muted-light w-full">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=900"
                  alt="Motimahal Lodge garden veranda"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <p className="font-serif italic text-xs text-muted mt-3 text-center">
                Our garden veranda in Bharatpur
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          ROOMS - EDITORIAL BORDERLESS SECTION
          ───────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-border bg-primary-light/10">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent mb-2">
                WHERE YOU'LL STAY
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-foreground">
                Our Guest Rooms
              </h2>
              <div className="w-10 h-0.5 bg-primary-accent mt-4"></div>
            </div>
            {hasSearched ? (
              <div className="flex items-center gap-2 text-xs text-muted border border-border rounded-none px-4 py-2 bg-card">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{checkIn} → {checkOut}</span>
                <button
                  onClick={() => setHasSearched(false)}
                  className="ml-1 text-primary-accent underline font-semibold cursor-pointer hover:opacity-75"
                >
                  Clear
                </button>
              </div>
            ) : (
              <Link href="/rooms" className="btn-luxury-link cursor-pointer shrink-0">
                All rooms <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {isLoaded && roomTypes.map((room) => {
              const isAvailable    = checkAvailability(room.id, checkIn, checkOut);
              const availableUnits = getAvailableCount(room.id, checkIn, checkOut);
              return (
                <div key={room.id} className="group flex flex-col items-start bg-transparent">

                  {/* Polaroid Frame for Room Photo */}
                  <div className="relative p-2.5 bg-white border border-border/80 shadow-sm w-full transition-shadow duration-300 group-hover:shadow-md shrink-0">
                    <div className="relative h-56 w-full bg-muted-light">
                      <Image
                        src={room.photos[0]}
                        alt={room.name}
                        fill
                        className="object-cover transition-opacity duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {hasSearched && (
                        <span className={`absolute top-2 right-2 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 ${
                          isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {isAvailable ? `${availableUnits} left` : 'Full'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Room Details below the frame */}
                  <div className="w-full pt-6 flex flex-col flex-1">
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary-accent transition-colors leading-tight">
                        {room.name}
                      </h3>
                      <span className="text-sm font-bold text-primary-accent shrink-0">
                        NPR {room.price.toLocaleString()}
                        <span className="text-[10px] font-normal text-muted">/night</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Minimalist Amenities */}
                    <div className="flex flex-wrap gap-1 mb-6">
                      {room.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[9px] font-semibold uppercase tracking-wider text-muted/80 bg-primary-light/50 border border-border/40 px-2 py-0.5">
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-[9px] font-semibold text-muted bg-primary-light/50 px-2 py-0.5">
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/rooms/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:text-primary-accent transition-colors pb-1 border-b border-primary/20 hover:border-primary-accent"
                    >
                      View & Book <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FOOD - REFINED LAYOUT
          ───────────────────────────────────────────────────────── */}
      <section className="border-t border-border">

        {/* Full-width kitchen photo banner */}
        <div className="relative h-[420px] sm:h-[500px] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=1800"
            alt="Family kitchen at Motimahal Lodge"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/45 to-transparent" />
          
          <div className="absolute inset-0 flex items-end px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto w-full">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent block mb-3">
                GHAR KO KHANA
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4 leading-tight max-w-md">
                Fresh meals from our family kitchen
              </h2>
              <p className="text-sm text-white/70 max-w-sm leading-relaxed mb-6 font-sans">
                Fresh ingredients cooked daily from our garden and the local market.
                Enjoy our famous tandoori dishes, dal bhat, momos, and fresh local pickles.
              </p>
              
              <Link 
                href="/food" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-primary-accent text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-accent/90 transition-colors cursor-pointer"
              >
                <Utensils className="h-3.5 w-3.5" /> View Full Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Food items grid - Clean & borderless with fine dividers */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
              {isLoaded && featuredFood.map((item) => (
                <div key={item.id} className="flex items-center gap-5 pb-6 border-b border-border/50 group">
                  {item.image && (
                    <div className="relative h-16 w-16 bg-muted-light shrink-0 border border-border/80 p-0.5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-serif text-sm font-bold text-foreground group-hover:text-primary-accent transition-colors truncate">
                        {item.name}
                      </p>
                      <p className="text-xs font-bold text-primary-accent shrink-0 tabular-nums">
                        NPR {item.price}
                      </p>
                    </div>
                    <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/food" className="btn-luxury-outline rounded-none inline-flex cursor-pointer">
                Order from kitchen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
