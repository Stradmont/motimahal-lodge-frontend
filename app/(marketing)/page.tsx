import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import WhyChooseSection from '@/components/WhyChooseSection';
import AboutSection from '@/components/AboutSection';
import VideoSection from '@/components/VideoSection';
import RiverfrontBreakSection from '@/components/RiverfrontBreakSection';
import AccommodationShowcaseSection from '@/components/AccommodationShowcaseSection';
import CtaSection from '@/components/CtaSection';
import { SITE_URL } from '@/lib/config/env.config';
import { PublicSettingsService } from '@/lib/services/settings.service';

export const metadata: Metadata = {
  title: 'Motimahal Lodge & Restaurant | Rooms in Bharatpur, Chitwan',
  description:
    'Family-run lodge in Bharatpur near the Narayani River. Clean AC rooms, hot shower, on-site restaurant, and easy access for Chitwan visitors.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Motimahal Lodge & Restaurant | Rooms in Bharatpur, Chitwan',
    description:
      'Clean AC rooms, fresh food, and family hospitality near the Narayani River in Bharatpur, Chitwan.',
    url: SITE_URL,
    siteName: 'Motimahal Lodge & Restaurant',
    images: [
      {
        url: `${SITE_URL}/heroes/contact-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Motimahal Lodge Narayani Riverfront View',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motimahal Lodge & Restaurant | Rooms in Bharatpur, Chitwan',
    description:
      'Clean AC rooms, fresh food, and family hospitality near the Narayani River in Bharatpur, Chitwan.',
    images: [`${SITE_URL}/heroes/contact-hero.jpg`],
  },
};

export default async function HomePage() {
  const settingsRes = await PublicSettingsService.getContactSettings().catch(() => null);
  const settings = settingsRes?.data;

  const hotelSchema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: 'Motimahal Lodge & Restaurant',
    url: SITE_URL,
    image: `${SITE_URL}/heroes/contact-hero.jpg`,
    description:
      'Family-run lodge in Bharatpur near the Narayani River. Clean AC rooms, hot shower, on-site restaurant, and easy access for Chitwan visitors.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || 'Narayani Riverfront',
      addressLocality: settings?.cityProvince ? settings.cityProvince.split(',')[0].trim() : 'Bharatpur',
      addressRegion: 'Chitwan',
      addressCountry: 'NP',
    },
    telephone: settings?.primaryPhone || undefined,
    email: settings?.email || undefined,
    priceRange: 'NPR 3500 - 8500',
    checkinTime: '12:00',
    checkoutTime: '11:00',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Solar Hot Shower', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Garden & River View', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Tandoori Restaurant', value: true },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col text-brand-charcoal bg-texture">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
      />
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
