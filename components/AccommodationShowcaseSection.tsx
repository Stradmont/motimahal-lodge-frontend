import React from 'react';
import Link from 'next/link';
import { ROOMS_DATA } from '@/lib/data';
import { Check } from 'lucide-react';

export default function AccommodationShowcaseSection() {
  return (
    <section className="py-20 sm:py-28 border-b border-brand-border relative text-brand-charcoal bg-texture">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-brand-green text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
            Stay With Us
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-charcoal">
            ACCOMMODATION
          </h2>
        </div>

        {ROOMS_DATA.map((room, roomIdx) => {
          const isEven = roomIdx % 2 === 0;
          return (
            <div
              key={room.id}
              className="bg-white rounded-lg border border-brand-border overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center shadow-xs"
            >
              <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : ''} aspect-16/10 sm:aspect-auto h-80 sm:h-112 bg-stone-100 overflow-hidden`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''} p-8 sm:p-12 space-y-5`}>
                <span className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wider block">
                  From NPR {room.priceNpr.toLocaleString()} / night
                </span>
                <h3 className="font-heading text-2xl sm:text-4xl font-bold text-brand-charcoal">
                  {room.name}
                </h3>
                <p className="text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed">
                  {room.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-stone-600 pt-1">
                  {room.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="bg-white px-3.5 py-1.5 rounded border border-brand-border flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                      <Check className="h-4 w-4 text-brand-green" />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-5">
                  <Link
                    href={`/rooms/${room.slug || room.id}#enquiry-section`}
                    className="bg-brand-green hover:bg-brand-green-dark text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-md transition-colors inline-block text-center"
                  >
                    Book Now
                  </Link>
                  <Link
                    href={`/rooms/${room.slug || room.id}`}
                    className="text-xs sm:text-sm font-bold text-brand-green hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
