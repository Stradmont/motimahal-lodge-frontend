'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import PageHero from '../../../components/PageHero';
import BookingModal from '../../../components/BookingModal';
import { ATTRACTIONS_DATA } from '../../../lib/data';
import { MapPin, Clock, CheckCircle, ArrowLeft, Calendar, Compass } from 'lucide-react';

export default function AttractionDetailPage() {
  const params = useParams();
  const attractionId = params?.id as string;
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const attraction = ATTRACTIONS_DATA.find((a) => a.id === attractionId) || ATTRACTIONS_DATA[0];

  if (!attraction) {
    return notFound();
  }

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
          bgImage={attraction.image}
        />

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Main Featured Photo */}
            <div className="relative rounded-lg overflow-hidden border border-[#E6DFD5] shadow-md bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attraction.image}
                alt={attraction.title}
                className="w-full h-80 sm:h-108 object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#1F3A2B] text-white text-xs font-semibold px-3 py-1.5 rounded shadow flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#C88A3B]" />
                <span>{attraction.distance}</span>
              </div>
            </div>

            {/* Description & Details */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#E6DFD5] shadow-xs space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#1F3A2B] mb-3">
                  About {attraction.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                  {attraction.fullDesc}
                </p>
              </div>

              {/* Highlights Checklist */}
              <div>
                <h4 className="font-heading text-lg font-bold text-[#1F3A2B] mb-3">
                  Key Highlights & Experience
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attraction.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-[#FAF7F2] p-3 rounded border border-[#E6DFD5]">
                      <CheckCircle className="h-4 w-4 text-[#9E4B27] shrink-0" />
                      <span className="font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excursion Assistance Banner */}
              <div className="pt-6 border-t border-[#E6DFD5] bg-[#1F3A2B] text-white p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[#C88A3B] text-xs font-bold uppercase tracking-wider block">
                    Need Guided Safari or Tour Assistance?
                  </span>
                  <h4 className="font-heading text-lg font-bold text-white">
                    Our Front Desk Arranges Tickets & Local Guides
                  </h4>
                </div>
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="bg-[#9E4B27] hover:bg-[#853C1D] text-white text-xs font-semibold px-5 py-3 rounded shadow transition-all cursor-pointer inline-flex items-center gap-2 shrink-0"
                >
                  <Compass className="h-4 w-4" />
                  <span>Enquire / Book Excursion</span>
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />

      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </div>
  );
}
