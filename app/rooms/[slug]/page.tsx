import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoomBySlug, ROOMS_DATA } from '@/lib/data';
import RoomDetailClient from '@/components/RoomDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);

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
  return ROOMS_DATA.map((room) => ({
    slug: room.slug,
  }));
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  return <RoomDetailClient room={room} />;
}
