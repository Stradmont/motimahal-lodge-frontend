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
    <div className="flex flex-col flex-1 bg-background">

      {/* ─────────────────────────────────────────────────────────
          HERO
          ───────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-20 bg-background">
        <div className="mx-auto max-w-7xl">

          {/* Eyebrow line */}
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent mb-6">
            Bharatpur, Chitwan · Family-run since 2061 B.S.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left: copy */}
            <div>
              <h1 className="text-title-hero mb-6 text-foreground">
                A quiet garden home<br />
                near Chitwan's forest
              </h1>
              <p className="text-sm sm:text-[15px] text-muted leading-relaxed mb-8 max-w-md">
                Namaste. Our journey began in 2061 B.S. with Motimahal Hotel & Tandoori Restaurant,
                built on warm family values and dedication. Today, Motimahal Lodge stands proudly
                beside the Narayani River, offering comfortable stays, peaceful gardens, and
                delicious food just 900 meters away.
              </p>
              <p className="text-xs text-primary-accent font-semibold tracking-[0.15em] uppercase">
                अतिथि देवो भव
              </p>

              {/* Booking widget */}
              <div className="mt-10 border border-border rounded-2xl bg-card p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">
                  Check availability
                </p>
                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="input-luxury-container">
                      <label className="input-luxury-label">
                        <Calendar className="h-3.5 w-3.5 text-primary-accent" /> Check-In
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
                    <div className="input-luxury-container">
                      <label className="input-luxury-label">
                        <Calendar className="h-3.5 w-3.5 text-primary-accent" /> Check-Out
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
                    <div className="input-luxury-container">
                      <label className="input-luxury-label">
                        <Users className="h-3.5 w-3.5 text-primary-accent" /> Guests
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
                  <button type="submit" className="btn-luxury-primary w-full cursor-pointer">
                    Check Availability <ChevronRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right: single strong photo */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=900"
                alt="Motimahal Lodge garden veranda"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-white/80 text-xs font-medium">Motimahal Lodge · Bharatpur</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          ROOMS
          ───────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-subtitle-tag mb-2">Where you'll stay</p>
              <h2 className="text-title-section">Our Cottage Rooms</h2>
              <div className="editorial-line" />
            </div>
            {hasSearched ? (
              <div className="flex items-center gap-2 text-xs text-muted border border-border rounded-xl px-4 py-2 bg-card">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoaded && roomTypes.map((room) => {
              const isAvailable    = checkAvailability(room.id, checkIn, checkOut);
              const availableUnits = getAvailableCount(room.id, checkIn, checkOut);
              return (
                <div key={room.id} className="group flex flex-col border border-border rounded-2xl overflow-hidden bg-card hover:border-primary-accent transition-colors duration-300">

                  {/* Photo */}
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <Image
                      src={room.photos[0]}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {hasSearched && (
                      <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                        isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {isAvailable ? `${availableUnits} left` : 'Full'}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary-accent transition-colors leading-tight">
                        {room.name}
                      </h3>
                      <span className="text-sm font-bold text-primary-accent shrink-0">
                        NPR {room.price.toLocaleString()}
                        <span className="text-[10px] font-normal text-muted">/night</span>
                      </span>
                    </div>

                    <p className="text-xs text-muted leading-relaxed line-clamp-2 flex-1">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/60">
                      {room.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[10px] font-semibold uppercase tracking-wide text-muted bg-muted-light px-2.5 py-1 rounded-lg">
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-[10px] font-semibold text-muted-light/80 bg-muted px-2.5 py-1 rounded-lg">
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/rooms/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                      className="btn-luxury-outline w-full text-center cursor-pointer"
                    >
                      View & Book <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    
      {/* ─────────────────────────────────────────────────────────
          FOOD
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
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/40 to-transparent" />
          <div className="absolute inset-0 flex items-end px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent mb-3">
                Ghar ko Khana
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-snug max-w-md">
                Fresh meals from our family kitchen
              </h2>
              <p className="text-sm text-white/70 max-w-sm leading-relaxed mb-6">
                Fresh ingredients cooked daily from our garden and the local market.
                Enjoy our famous tandoori dishes, dal bhat, momos, and fresh local pickles.
              </p>
              <Link href="/food" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-accent text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-accent/90 transition-colors cursor-pointer">
                <Utensils className="h-3.5 w-3.5" /> View full menu
              </Link>
            </div>
          </div>
        </div>

        {/* Food items grid below the photo */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 bg-card border-b border-border">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {isLoaded && featuredFood.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-card px-5 py-4 hover:bg-muted-light/30 transition-colors group">
                  {item.image && (
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary-accent transition-colors truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5 line-clamp-1 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-xs font-bold text-primary-accent mt-1 tabular-nums">
                      NPR {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link href="/food" className="btn-luxury-outline inline-flex cursor-pointer">
                Order from kitchen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

   

    </div>
  );
}
