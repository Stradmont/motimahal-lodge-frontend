import { MetadataRoute } from 'next';
import { fetchRooms } from '@/lib/api/rooms';
import { BLOG_DATA } from '@/lib/data';
import { SITE_URL } from '@/lib/config/env.config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticRoutes = [
    '',
    '/about',
    '/rooms',
    '/blog',
    '/gallery',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Room Slugs
  let roomRoutes: MetadataRoute.Sitemap = [];
  try {
    const rooms = await fetchRooms();
    if (rooms && rooms.length > 0) {
      roomRoutes = rooms.map((room) => ({
        url: `${baseUrl}/rooms/${room.slug || room.id}`,
        lastModified: room.updatedAt ? new Date(room.updatedAt).toISOString() : new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // fallback if backend is unreachable during build
  }

  // Dynamic Blog Slugs
  const blogRoutes: MetadataRoute.Sitemap = BLOG_DATA.map((post) => ({
    url: `${baseUrl}/blog/${post.slug || post.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...roomRoutes, ...blogRoutes];
}
