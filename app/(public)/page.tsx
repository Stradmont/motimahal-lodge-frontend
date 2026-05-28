'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Calendar, Users, Shield, CheckCircle2, ChevronRight,
  Moon, Utensils, ArrowRight, Leaf, Coffee,
} from 'lucide-react';

export default function Home() {
  const { roomTypes, checkAvailability, getAvailableCount, isLoaded, foodItems } = useApp();

  const getTodayStr = () => new Date().toISOString().split('T')[0];
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

  const featuredFood = isLoaded
    ? foodItems.filter((f) => f.isAvailable).slice(0, 6)
    : [];

  return (
    <div className="flex flex-col flex-1">

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1920')" }}
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-5 font-medium">
            Sauraha · Chitwan National Park · Nepal
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-white">
            Motimahal Lodge
          </h1>
          <p className="mt-4 text-base text-white/60 font-normal leading-relaxed max-w-lg">
            An eco-retreat at the edge of the jungle. Clean rooms, authentic dining, and warm Nepalese hospitality.
          </p>

          {/* Booking Widget */}
          <form
            onSubmit={handleSearch}
            className="mt-10 w-full max-w-2xl bg-card border border-border rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row items-stretch gap-1"
          >
            <div className="flex-1 flex flex-col px-4 py-3 rounded-xl hover:bg-muted-light transition-colors min-w-[120px]">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-muted mb-1 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" /> Check-In
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
                className="bg-transparent text-sm text-foreground font-semibold focus:outline-none border-0 p-0"
                required
              />
            </div>

            <div className="h-px sm:h-auto sm:w-px bg-border my-0 mx-1" />

            <div className="flex-1 flex flex-col px-4 py-3 rounded-xl hover:bg-muted-light transition-colors min-w-[120px]">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-muted mb-1 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" /> Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-sm text-foreground font-semibold focus:outline-none border-0 p-0"
                required
              />
            </div>

            <div className="h-px sm:h-auto sm:w-px bg-border my-0 mx-1" />

            <div className="flex-1 flex flex-col px-4 py-3 rounded-xl hover:bg-muted-light transition-colors min-w-[100px]">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-muted mb-1 flex items-center gap-1">
                <Users className="h-2.5 w-2.5" /> Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="bg-transparent text-sm text-foreground font-semibold focus:outline-none border-0 p-0 cursor-pointer"
              >
                {['1', '2', '3', '4'].map((n) => (
                  <option key={n} value={n}>{n} Guest{n !== '1' ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="shrink-0 bg-primary hover:bg-primary/90 text-primary-light font-semibold text-sm px-7 py-3 rounded-xl transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── ROOMS ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-primary mb-2">Accommodations</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our Rooms</h2>
          </div>

          {hasSearched ? (
            <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span><strong>{checkIn}</strong> → <strong>{checkOut}</strong></span>
              <button
                onClick={() => setHasSearched(false)}
                className="ml-1 underline opacity-60 hover:opacity-100"
              >
                Clear
              </button>
            </div>
          ) : (
            <Link href="/rooms" className="text-xs text-primary hover:underline flex items-center gap-1">
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoaded && roomTypes.map((room) => {
            const isAvailable = checkAvailability(room.id, checkIn, checkOut);
            const availableUnits = getAvailableCount(room.id, checkIn, checkOut);

            return (
              <div key={room.id} className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover-lift">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={room.photos[0]}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                    NPR {room.price.toLocaleString()} <span className="font-normal opacity-70">/ night</span>
                  </div>
                  {hasSearched && (
                    <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      isAvailable ? 'bg-emerald-600/90 text-white' : 'bg-red-600/90 text-white'
                    }`}>
                      {isAvailable ? `${availableUnits} Left` : 'Sold Out'}
                    </div>
                  )}
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5">
                      {room.name}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
                      {room.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {room.amenities.slice(0, 4).map((a, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-muted-light text-muted border border-border/60">
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-[11px] px-2 py-0.5 text-primary">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/rooms/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-primary text-primary hover:bg-primary hover:text-primary-light font-medium text-sm transition-all"
                  >
                    View & Book <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOD ── */}
      <section className="border-t border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-primary mb-2">Restaurant & In-Room Dining</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our Menu</h2>
            </div>
            <Link
              href="/food"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <Utensils className="h-3.5 w-3.5" /> Full Menu & Order
            </Link>
          </div>

          {/* Food cards — full image, minimal text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoaded && featuredFood.map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover-lift flex flex-col"
              >
                {/* Full image */}
                <div className="relative h-48 w-full bg-muted-light overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Coffee className="h-8 w-8 text-muted/30" />
                    </div>
                  )}
                  {/* Category tag */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-medium text-white">
                    {item.category}
                  </div>
                </div>

                {/* Minimal info */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <span className="text-sm font-bold text-primary shrink-0">
                    NPR {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Simple CTA row */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8">
            <p className="text-sm text-muted">
              Staying with us? Use your booking code to order directly to your room.
            </p>
            <Link
              href="/food"
              className="shrink-0 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-light px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              View Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="bg-muted-light border-t border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: Shield,
              title: 'Secure Booking',
              desc: 'Unique reference tokens (MM-2026-XXXX) protect your reservation. Confirmed instantly.',
            },
            {
              icon: Moon,
              title: 'Authentic Chitwan',
              desc: "Steps from jungle safaris, bird watching, and elephant encounters in Sauraha.",
            },
            {
              icon: Leaf,
              title: 'Eco-Friendly',
              desc: 'Solar heating, local sourcing, and minimal plastic — we care for Chitwan\'s landscape.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 items-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
