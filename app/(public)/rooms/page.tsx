'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ChevronRight, Users, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function RoomsPage() {
  const { roomTypes, isLoaded } = useApp();

  return (
    <div className="flex flex-col flex-1">

      {/* Header */}
      <section className="relative bg-hero text-primary-light py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative max-w-3xl z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4 font-medium">
            Sauraha · Chitwan National Park
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-3 text-white">
            Rooms & Suites
          </h1>
          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            From budget-friendly twin rooms to deluxe jungle-view suites — find the right fit for your stay.
          </p>
        </div>
      </section>

      {/* Room Listings */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="flex flex-col gap-10">
          {isLoaded && roomTypes.map((room) => (
            <div
              key={room.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Photo */}
              <div className="relative h-64 sm:h-72 lg:h-auto lg:col-span-5 bg-muted-light overflow-hidden">
                <Image
                  src={room.photos[0]}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                {room.photos.length > 1 && (
                  <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-medium text-white">
                    {room.photos.length} Photos
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between gap-5">
                <div>
                  {/* Name & price */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border pb-4 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {room.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                        <Users className="h-3.5 w-3.5" />
                        <span>Max {room.id === 'deluxe' ? '4' : room.id === 'standard' ? '3' : '2'} Guests</span>
                        <span>&bull;</span>
                        <span>{room.id === 'normal' ? 'Twin Beds' : room.id === 'standard' ? 'Queen Bed' : 'King Bed'}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xl font-semibold text-primary">NPR {room.price.toLocaleString()}</span>
                      <span className="text-[10px] block text-muted uppercase tracking-wider mt-0.5">per night</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted leading-relaxed mb-5">
                    {room.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded bg-muted-light text-muted border border-border/60"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer action */}
                <div className="border-t border-border pt-5">
                  <Link
                    href={`/rooms/${room.id}`}
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-light py-2.5 px-6 rounded-xl font-medium text-sm transition-all"
                  >
                    View & Book <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer strip */}
      <section className="bg-muted-light border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: Clock,
              title: '24 Hour Support',
              desc: 'Our desk staff are ready at any hour to help with safari planning or room bookings.',
            },
            {
              icon: ShieldCheck,
              title: 'Verified Payment',
              desc: 'eSewa, bank transfer, or Pay at Hotel — all securely handled.',
            },
            {
              icon: Sparkles,
              title: 'Authentic Chitwan',
              desc: 'Steps from Sauraha tourist hubs, elephant crossings, and jungle tracks.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 items-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
