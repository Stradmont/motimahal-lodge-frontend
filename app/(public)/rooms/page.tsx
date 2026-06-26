'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ChevronRight, Users, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function RoomsPage() {
  const { roomTypes, isLoaded } = useApp();

  return (
    <div className="flex flex-col flex-1 bg-background">

      {/* Header Banner */}
      <section className="banner-luxury">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay" />
        
        <div className="relative max-w-3xl z-10">
          <span className="badge-luxury mb-4">
            <Sparkles className="h-3 w-3" /> Comfortable Riverside Rooms
          </span>
          <h1 className="text-title-section mb-4">
            Our Rooms
          </h1>
          <div className="editorial-line mx-auto"></div>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed mt-4">
            We offer clean, cozy, and comfortable rooms in Bharatpur, near the beautiful Narayani River. Each room is designed to stay naturally cool and looks out to our gardens.
          </p>
        </div>
      </section>

      {/* Room Listings */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 flex-1 w-full">
        <div className="flex flex-col gap-12">
          {isLoaded && roomTypes.map((room) => (
            <div
              key={room.id}
              className="group card-luxury grid grid-cols-1 lg:grid-cols-12"
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
                  <span className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-foreground border border-border/40 shadow-sm">
                    {room.photos.length} Photos
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 sm:p-10 lg:col-span-7 flex flex-col justify-between gap-6">
                <div>
                  {/* Name & price */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-5 mb-5">
                    <div>
                      <h2 className="text-title-card group-hover:text-primary-accent transition-colors">
                        {room.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted font-medium">
                        <Users className="h-3.5 w-3.5 text-primary-accent" />
                        <span>Max {room.id === 'deluxe' ? '4' : room.id === 'standard' ? '3' : '2'} Guests</span>
                        <span>&bull;</span>
                        <span className="capitalize">{room.id === 'normal' ? 'Twin Beds' : room.id === 'standard' ? 'Queen Bed' : 'King Bed'}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-2xl font-bold text-primary">NPR {room.price.toLocaleString()}</span>
                      <span className="text-[9px] block text-muted font-bold uppercase tracking-wider mt-0.5">per night</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                    {room.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="badge-tag-luxury"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer action */}
                <div className="border-t border-border pt-6 flex items-center justify-end">
                  <Link
                    href={`/rooms/${room.id}`}
                    className="btn-luxury-primary"
                  >
                    View Details & Book <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer strip */}
      <section className="bg-primary-light/20 border-t border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            {
              icon: Clock,
              title: '24-Hour Sanctuary Helpdesk',
              desc: 'Our lodge reception is open 24/7 to organize safari permits, boat bookings, or room adjustments.',
            },
            {
              icon: ShieldCheck,
              title: 'Flexible & Secure Booking',
              desc: 'Confirm online using standard reference tokens, with payment via eSewa or directly at check-out.',
            },
            {
              icon: Sparkles,
              title: 'Narayani River Access',
              desc: 'Located near the beautiful Narayani River, with easy access to central Pulchowk and Narayanghat.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 items-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-primary-accent shadow-sm">
                <Icon className="h-5 w-5 stroke-[1.5]" />
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
