'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import AttractionCard from '@/components/AttractionCard';
import { ATTRACTIONS_DATA } from '@/lib/data';
import { MapPin, Phone } from 'lucide-react';

export default function AttractionDetailPage() {
  const params = useParams();
  const attractionId = params?.id as string;

  const attraction = ATTRACTIONS_DATA.find((a) => a.id === attractionId) || ATTRACTIONS_DATA[0];

  if (!attraction) {
    return notFound();
  }

  const otherAttractions = ATTRACTIONS_DATA.filter((a) => a.id !== attraction.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title={attraction.title}
          subtitle={attraction.shortDesc}
          badge={attraction.category}
          breadcrumbs={[
            { label: 'Attractions', href: '/attractions' },
            { label: attraction.title },
          ]}
        />

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              <div className="lg:col-span-8 space-y-8">
                <div className="relative rounded-lg overflow-hidden border border-[#E6DFD5] shadow-md bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attraction.image}
                    alt={attraction.title}
                    className="w-full h-80 sm:h-108 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#1F3A2B] text-white text-xs font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{attraction.distance}</span>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg border border-[#E6DFD5] shadow-xs space-y-6">
                  <h2 className="font-heading text-3xl font-bold text-[#1F3A2B]">
                    About {attraction.title}
                  </h2>

                  <div className="space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                    <p>{attraction.fullDesc}</p>
                    <p>
                      Motimahal Lodge is conveniently situated near major Chitwan attractions. Our family front desk is always happy to assist with local taxi bookings, safari arrangements, or recommendations for riverfront sunset viewing spots.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-lg border border-[#E6DFD5] shadow-md space-y-5 sticky top-24">
                  <span className="text-xs font-bold text-[#1F3A2B] uppercase tracking-wider block">
                    Traveler Assistance
                  </span>
                  <h3 className="font-heading text-xl font-bold text-[#2D2B2A]">
                    Need Help Planning Your Visit?
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Our front desk can help organize safari jeep tickets, boat rides, or local guide hire.
                  </p>
                  <a
                    href="tel:+9779855012345"
                    className="w-full bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-xs sm:text-sm py-3.5 px-4 rounded transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Ask Front Desk</span>
                  </a>
                </div>
              </div>

            </div>

            {otherAttractions.length > 0 && (
              <div className="pt-12 border-t border-[#E6DFD5]">
                <h3 className="font-heading text-2xl font-bold text-[#1F3A2B] mb-6">
                  Explore Other Nearby Sights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {otherAttractions.map((item) => (
                    <AttractionCard key={item.id} attraction={item} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
