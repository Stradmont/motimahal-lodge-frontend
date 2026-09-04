'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import WhyChooseSection from '@/components/WhyChooseSection';
import AboutSection from '@/components/AboutSection';
import VideoSection from '@/components/VideoSection';
import RiverfrontBreakSection from '@/components/RiverfrontBreakSection';
import AccommodationShowcaseSection from '@/components/AccommodationShowcaseSection';

import CtaSection from '@/components/CtaSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col text-brand-charcoal bg-texture">
      <Navbar />

      <main className="flex-1">

        {/* 1. HERO SECTION */}
        <Hero />

        {/* 2. ABOUT US SECTION */}
        <AboutSection />

        {/* 3. WHY CHOOSE MOTIMAHAL SECTION */}
        <WhyChooseSection />

        {/* 4. VIDEO GALLERY SECTION */}
        <VideoSection />

        {/* 5. FULL-WIDTH BACKGROUND IMAGE — NARAYANI RIVERFRONT PROMENADE */}
        <RiverfrontBreakSection />

        {/* 6. ACCOMMODATION SHOWCASE SECTION */}
        <AccommodationShowcaseSection />

        {/* 7. REUSABLE ENQUIRY CTA SECTION */}
        <CtaSection />

      </main>

      <Footer />
    </div>
  );
}
