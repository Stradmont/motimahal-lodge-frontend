import React from 'react';
import { Metadata } from 'next';
import RoomsClient from '@/components/marketing/RoomsClient';
import { SITE_URL } from '@/lib/config/env.config';

export const metadata: Metadata = {
  title: 'Rooms & Rates | Motimahal Lodge, Bharatpur',
  description:
    'See room options and nightly rates at Motimahal Lodge in Bharatpur. Features air conditioning, hot showers, free WiFi, and parking.',
  alternates: {
    canonical: `${SITE_URL}/rooms`,
  },
  openGraph: {
    title: 'Rooms & Rates | Motimahal Lodge, Bharatpur',
    description:
      'Clean, simple rooms in Bharatpur with AC, hot showers, and free parking for solo travelers and families.',
    url: `${SITE_URL}/rooms`,
    siteName: 'Motimahal Lodge & Restaurant',
    images: [
      {
        url: `${SITE_URL}/heroes/hero-bg.jpg`,
        width: 1200,
        height: 630,
        alt: 'Motimahal Lodge Rooms',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const roomsBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Rooms & Accommodation',
      item: `${SITE_URL}/rooms`,
    },
  ],
};

export default function RoomsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roomsBreadcrumbSchema) }}
      />
      <RoomsClient />
    </>
  );
}
