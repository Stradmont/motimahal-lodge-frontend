'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import FoodMenuSection from '@/components/FoodMenuSection';
import WhyChooseSection from '@/components/WhyChooseSection';

export default function FoodPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Tandoori Kitchen & Dining"
          subtitle="Clay-oven roasted tandoori grills, authentic Nepalese Thakali set meals, and fresh river fish."
          breadcrumbs={[{ label: 'Tandoori Menu' }]}
        />

        <FoodMenuSection />
        <WhyChooseSection />
      </main>

      <Footer />
    </div>
  );
}
