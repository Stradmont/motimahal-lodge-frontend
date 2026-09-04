'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyChooseSection from '@/components/WhyChooseSection';
import AboutCarousel from '@/components/AboutCarousel';
import { Bookmark } from 'lucide-react';

import CtaSection from '@/components/CtaSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col text-brand-charcoal bg-texture">
      <Navbar />

      <main className="flex-1">

        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[60vh] min-h-[440px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000')`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/50" />

          <div className="relative z-20 mx-auto max-w-5xl px-6 text-center text-white space-y-4">
            <span className="text-white/95 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] block">
              EXPERIENCE MOTIMAHAL
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              ABOUT US
            </h1>
          </div>
        </section>

        {/* 2. ABOUT MOTIMAHAL SECTION WITH backs.png BACKGROUND TEXTURE */}
        <section className="py-20 sm:py-28 border-b border-brand-border relative text-brand-charcoal overflow-hidden bg-texture">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 mb-16 sm:mb-20">
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-charcoal tracking-wider uppercase text-center lg:text-left">
              ABOUT MOTIMAHAL
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Left Image: Large Lodge Photography */}
              <div className="lg:col-span-5 rounded-lg overflow-hidden border border-brand-border shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000"
                  alt="Motimahal Lodge Grounds"
                  className="w-full h-120 sm:h-144 object-cover"
                />
              </div>

              {/* Right Content: Family Portrait Inset + Narrative Story */}
              <div className="lg:col-span-7 space-y-8">

                {/* Family Portrait Inset */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-6 sm:p-8 rounded-lg border border-brand-border shadow-xs">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden shrink-0 border border-brand-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
                      alt="Motimahal Family Hosts"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs sm:text-sm font-bold text-brand-green uppercase tracking-wider block">Family Hosts & Founders</span>
                    <h4 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">The Sapkota Family</h4>
                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                      Greeting every traveler with genuine Nepalese hospitality in Bharatpur-10 for over 30 years.
                    </p>
                  </div>
                </div>

                {/* Editorial Story Paragraphs */}
                <div className="space-y-6 text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
                  <p>
                    Welcome to Motimahal Lodge and Restaurant, a cherished haven located in Bharatpur-10, Chitwan. Established over three decades ago by our family, our lodge stands as a testament to an unwavering passion for genuine hospitality, fresh regional dining, and peaceful rest.
                  </p>
                  <p>
                    With over three decades of legacy, our family proudly continues the journey of welcoming travelers from around the world to experience the beauty of Chitwan District. Our lodge isn’t just a place to rest; it’s a peaceful doorway to unforgettable memories and riverfront sunsets.
                  </p>
                  <p>
                    From the moment you step through our gates, you’re enveloped in the warmth of local hospitality. As a family-run establishment, we take pride in the personal care we infuse into every aspect of your stay. You can gather in our outdoor garden or dining area at night to enjoy fresh tandoori grills, continuous hot showers, and friendly host conversations.
                  </p>
                  <p>
                    Motimahal Lodge is deeply rooted in the heart of Bharatpur. We’ve spent years forging strong connections with the local community, sourcing fresh ingredients from surrounding Chitwan farmers, and providing authentic care for every visitor.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Full Viewport Width (Edge-to-Edge) Interactive Image Carousel */}
          <div className="w-full">
            <AboutCarousel />
          </div>
        </section>

        {/* 3. FACILITIES SECTION WITH backs-2.png BACKGROUND TEXTURE */}
        <section className="py-20 sm:py-28 border-b border-brand-border relative bg-texture">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-charcoal tracking-wider uppercase text-center lg:text-left">
              FACILITIES
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Left Column: Bookmark Facility Items List */}
              <div className="lg:col-span-6 space-y-10">

                {/* Facility 1: Restaurant & Dining */}
                <div className="flex items-start gap-5">
                  <Bookmark className="h-6 w-6 text-brand-green shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">Restaurant & Dining</h3>
                    <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                      Our on-site restaurant serves a delightful array of local and international cuisines. Savor the flavors of traditional Nepali dishes or indulge in familiar western delights. Our attentive staff caters to your dietary preferences and ensures a pleasant dining experience.
                    </p>
                  </div>
                </div>

                {/* Facility 2: Common Areas */}
                <div className="flex items-start gap-5">
                  <Bookmark className="h-6 w-6 text-brand-green shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">Common Areas</h3>
                    <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                      Relax and unwind in our spacious common areas, where you can meet fellow travelers and share stories of your adventures. We provide a friendly atmosphere, encouraging a sense of community and camaraderie.
                    </p>
                  </div>
                </div>

                {/* Facility 3: Hot Showers */}
                <div className="flex items-start gap-5">
                  <Bookmark className="h-6 w-6 text-brand-green shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">Hot Showers</h3>
                    <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                      After a day of safari or travel, rejuvenate with a hot shower, a true luxury for travelers.
                    </p>
                  </div>
                </div>

                {/* Facility 4: Free Wi-Fi */}
                <div className="flex items-start gap-5">
                  <Bookmark className="h-6 w-6 text-brand-green shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">Free Wi-Fi</h3>
                    <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                      Stay connected with loved ones back home and share your incredible moments with them using our complimentary Wi-Fi service.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: Stacked Memory Photos */}
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-lg overflow-hidden border border-brand-border shadow-xs aspect-16/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000"
                    alt="Lodge Memory Gallery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden border border-brand-border shadow-xs aspect-16/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000"
                    alt="Narayani River Sunset"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. FULL-WIDTH BACKGROUND IMAGE */}
        <section className="relative w-full h-[52vh] min-h-[380px] flex items-center justify-center overflow-hidden bg-stone-900 border-y border-brand-border">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1547970810-dc9223d49122?auto=format&fit=crop&q=80&w=2000')`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/35" />

          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <span className="text-white/95 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] block">
              BHARATPUR, CHITWAN
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-sm leading-tight">
              A peaceful sanctuary between the Narayani River and the wild.
            </h2>
          </div>
        </section>

        {/* 6. FINAL PLAN YOUR STAY CTA */}
        <CtaSection
          title="Plan Your Stay at Motimahal Lodge"
          description="Have questions about room rates, airport pickup, or Chitwan safari excursions? Our family desk is at your service."
          buttonText="Check Availability"
          bgTexture={false}
          className="bg-white"
        />

      </main>

      <Footer />
    </div>
  );
}
