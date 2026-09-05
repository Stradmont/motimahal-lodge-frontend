import React from 'react';
import { Metadata } from 'next';
import GalleryClient from '@/components/marketing/GalleryClient';
import { SITE_URL } from '@/lib/config/env.config';

export const metadata: Metadata = {
  title: 'Photos | Motimahal Lodge & Restaurant, Bharatpur',
  description:
    'Take a look at photos of our guest rooms, garden, and restaurant near the Narayani River in Bharatpur.',
  alternates: {
    canonical: `${SITE_URL}/gallery`,
  },
  openGraph: {
    title: 'Photos | Motimahal Lodge & Restaurant, Bharatpur',
    description:
      'Photos of our lodge rooms, restaurant, and surroundings in Bharatpur.',
    url: `${SITE_URL}/gallery`,
    siteName: 'Motimahal Lodge & Restaurant',
    images: [
      {
        url: `${SITE_URL}/gallery/narayani-river-gallery.jpg`,
        width: 1200,
        height: 630,
        alt: 'Motimahal Lodge Gallery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const galleryBreadcrumbSchema = {
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
      name: 'Gallery',
      item: `${SITE_URL}/gallery`,
    },
  ],
};

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryBreadcrumbSchema) }}
      />
      <GalleryClient />
    </>
  );
}
