'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyChooseSection from '@/components/WhyChooseSection';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import FacilitiesSection from '@/components/FacilitiesSection';
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
              backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1800')",
            }}
          />
          {/* Soft Dark Overlay */}
          <div className="absolute inset-0 z-10 bg-black/45" />

          {/* Centered Typography */}
          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <span className="text-stone-300 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
              Nepalese Hospitality
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white drop-shadow-md leading-tight">
              About Motimahal Lodge
            </h1>
            <p className="text-stone-200 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed font-normal">
              A peaceful family sanctuary offering cozy rooms, authentic dining, and true riverfront warmth in Bharatpur, Chitwan.
            </p>
          </div>
        </section>

        {/* 2. ABOUT MOTIMAHAL SECTION WITH backs.png BACKGROUND TEXTURE */}
        <section className="py-16 sm:py-24 border-b border-brand-border relative bg-texture">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-brand-green text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block">
                Our Story & Heritage
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-brand-charcoal">
                A Family Tradition of Care in Bharatpur
              </h2>
            </div>

            {/* Content Layout: Left Large Video + Right Story Inset */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

              {/* Left Main Lodge Intro Video with Controls */}
              <div className="lg:col-span-5 rounded-lg overflow-hidden border border-brand-border shadow-xs">
                <CustomVideoPlayer
                  src="/about/intro-video.mp4"
                  className="w-full h-120 sm:h-144"
                />
              </div>

              {/* Right Content: Family Portrait Inset + Narrative Story */}
              <div className="lg:col-span-7 space-y-8">

                {/* Family Portrait Inset */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-6 sm:p-8 rounded-lg border border-brand-border shadow-xs">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden shrink-0 border border-brand-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/about/owner-side-image.png"
                      alt="Motimahal Family Hosts"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs sm:text-sm font-bold text-brand-green uppercase tracking-wider block">Family Hosts & Founders</span>
                    <h4 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">The Sapkota Family</h4>
                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                      &ldquo;We treat every guest who enters Motimahal Lodge not as a customer, but as an honored visitor in our family home.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Narrative Paragraphs */}
                <div className="space-y-4 text-stone-800 text-base sm:text-lg leading-relaxed font-normal">
                  <p>
                    With over three decades of legacy, our family proudly continues the journey of welcoming travelers from around the world to experience the beauty of Chitwan District. Our lodge isn’t just a place to rest; it’s a peaceful doorway to unforgettable memories and riverfront sunsets.
                  </p>
                  <p>
                    From the moment you step through our gates, you’re enveloped in the warmth of local hospitality. As a family-run establishment, we take pride in the personal care we infuse into every aspect of your stay. You can gather in our outdoor garden or dining area at night to enjoy fresh tandoori grills, continuous hot showers, and friendly host conversations.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </section>

        {/* 3. FACILITIES SECTION WITH backs-2.png BACKGROUND TEXTURE */}
        <FacilitiesSection />

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
          bgTexture={true}
        />

      </main>

      <Footer />
    </div>
  );
}
