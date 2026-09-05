import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoomBySlug, Room } from '@/lib/data';
import { fetchRoomBySlug, fetchRooms } from '@/lib/api/rooms';
import { RoomItem } from '@/lib/types/room';
import RoomDetailClient from '@/components/RoomDetailClient';
import { SITE_URL } from '@/lib/config/env.config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function mapRoomItemToRoom(item: RoomItem): Room {
  const heroImage =
    item.image?.url ||
    (typeof item.imageId === 'string' && item.imageId.startsWith('http')
      ? item.imageId
      : '/about/room1.PNG');

  const galleryImages = (item.galleryImages?.map((g) => g.url) || item.galleryImageIds || []).filter(Boolean);

  return {
    id: item.id,
    slug: item.slug || item.id,
    name: item.name,
    category: item.type || 'Deluxe',
    priceNpr: item.pricePerNight,
    capacity: `${item.capacity} Guests`,
    bedType: item.bedType || 'King Size Bed',
    sizeSqFt: item.sizeSqFt || 350,
    image: heroImage,
    galleryImages: galleryImages.length > 0 ? galleryImages : [heroImage],
    amenities: item.amenities || [],
    description: item.shortDescription || item.description?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
    fullDescription: item.description ? [item.description] : [],
    features: item.amenities || [],
    featured: item.isFeatured,
    maxUnits: item.totalUnits,
  };
}

async function getRoomData(slug: string): Promise<Room | null> {
  const apiRoom = await fetchRoomBySlug(slug);
  if (apiRoom) {
    return mapRoomItemToRoom(apiRoom);
  }

  const staticRoom = getRoomBySlug(slug);
  if (staticRoom) {
    return staticRoom;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomData(slug);

  if (!room) {
    return {
      title: 'Room Not Found | Motimahal Lodge & Restaurant',
      description: 'The requested room details could not be found.',
    };
  }

  const canonicalUrl = `${SITE_URL}/rooms/${room.slug}`;
  const ogImage = room.image.startsWith('http') ? room.image : `${SITE_URL}${room.image}`;

  return {
    title: `${room.name} | Motimahal Lodge, Bharatpur`,
    description: `${room.name} at Motimahal Lodge in Bharatpur. Fits ${room.capacity} with ${room.bedType}, AC, hot shower, and free WiFi at NPR ${room.priceNpr.toLocaleString()} per night.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${room.name} — Room Details & Rates | Motimahal Lodge`,
      description: `Book the ${room.name} at Motimahal Lodge in Bharatpur. Includes AC, hot shower, and free parking.`,
      url: canonicalUrl,
      siteName: 'Motimahal Lodge & Restaurant',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: room.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${room.name} | Motimahal Lodge, Bharatpur`,
      description: `Book the ${room.name} at Motimahal Lodge in Bharatpur. Includes AC, hot shower, and free parking.`,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  try {
    const apiRooms = await fetchRooms();
    if (apiRooms && apiRooms.length > 0) {
      return apiRooms.map((room) => ({
        slug: room.slug || room.id,
      }));
    }
  } catch {
    // fallback
  }
  return [];
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const room = await getRoomData(slug);

  if (!room) {
    notFound();
  }

  const roomUrl = `${SITE_URL}/rooms/${room.slug}`;

  const hotelRoomSchema = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.description,
    image: [room.image],
    bed: {
      '@type': 'BedDetails',
      typeOfBed: room.bedType,
    },
    occupancy: {
      '@type': 'QuantitativeValue',
      value: parseInt(room.capacity) || 2,
    },
    amenityFeature: (room.amenities || []).map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    offeredBy: {
      '@type': 'Hotel',
      name: 'Motimahal Lodge & Restaurant',
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
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
        name: 'Rooms',
        item: `${SITE_URL}/rooms`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: room.name,
        item: roomUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelRoomSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <RoomDetailClient room={room} />
    </>
  );
}
