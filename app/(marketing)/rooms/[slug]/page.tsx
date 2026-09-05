import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoomBySlug, Room } from '@/lib/data';
import { fetchRoomBySlug, fetchRooms } from '@/lib/api/rooms';
import { RoomItem } from '@/lib/types/room';
import RoomDetailClient from '@/components/RoomDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function mapRoomItemToRoom(item: RoomItem): Room {
  const heroImage =
    item.image?.url ||
    (typeof item.imageId === 'string' && item.imageId.startsWith('http')
      ? item.imageId
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80');

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
    description: item.shortDescription || item.description || '',
    fullDescription: item.description ? [item.description] : [],
    features: item.amenities || [],
    featured: item.isFeatured,
    maxUnits: item.totalUnits,
  };
}

async function getRoomData(slug: string): Promise<Room | null> {
  // 1. Try API first
  const apiRoom = await fetchRoomBySlug(slug);
  if (apiRoom) {
    return mapRoomItemToRoom(apiRoom);
  }

  // 2. Fall back to static data
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

  return {
    title: `${room.name} | Motimahal Lodge & Restaurant, Chitwan`,
    description: room.description,
    openGraph: {
      title: `${room.name} — Motimahal Lodge Chitwan`,
      description: room.description,
      images: [{ url: room.image }],
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

  return <RoomDetailClient room={room} />;
}
