import React from 'react';
import { Metadata } from 'next';
import ContactClient from '@/components/marketing/ContactClient';
import { SITE_URL } from '@/lib/config/env.config';
import { PublicSettingsService } from '@/lib/services/settings.service';

export const metadata: Metadata = {
  title: 'Contact & Location | Motimahal Lodge, Bharatpur',
  description:
    'Call or message our front desk in Bharatpur. We can help you book rooms, reserve tables, or plan your trip to Chitwan.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact & Location | Motimahal Lodge, Bharatpur',
    description:
      'Need a room or have questions about visiting Chitwan? Get in touch with our front desk team in Bharatpur.',
    url: `${SITE_URL}/contact`,
    siteName: 'Motimahal Lodge & Restaurant',
    images: [
      {
        url: `${SITE_URL}/heroes/contact-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Contact Motimahal Lodge',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function ContactPage() {
  const settingsRes = await PublicSettingsService.getContactSettings().catch(() => null);
  const settings = settingsRes?.data;

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Motimahal Lodge & Restaurant',
    url: `${SITE_URL}/contact`,
    image: `${SITE_URL}/heroes/contact-hero.jpg`,
    telephone: settings?.primaryPhone || undefined,
    email: settings?.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || 'Narayani Riverfront',
      addressLocality: settings?.cityProvince ? settings.cityProvince.split(',')[0].trim() : 'Bharatpur',
      addressRegion: 'Chitwan',
      addressCountry: 'NP',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactClient />
    </>
  );
}
