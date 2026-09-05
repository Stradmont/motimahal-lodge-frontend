import {
  GallerySectionItem,
  CreateGallerySectionInput,
  GallerySectionStatus,
} from '../types/gallery';
import { getStoredMedia } from '../api/media';

const GALLERY_STORAGE_KEY = 'motimahal_admin_gallery_sections_v1';
export const GALLERY_SECTIONS_UPDATED_EVENT = 'motimahal_gallery_sections_updated';

const initialGallerySections: GallerySectionItem[] = [
  {
    id: 'SEC-101',
    title: 'Homepage Showcase Gallery',
    slug: 'homepage-showcase-gallery',
    description: 'Featured hero photography showcasing the Narayani riverbank, lodge architecture, and sunset vibes.',
    status: GallerySectionStatus.ACTIVE,
    mediaIds: ['MED-101', 'MED-105', 'MED-106', 'MED-108'],
    sortOrder: 1,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-04T16:00:00Z',
  },
  {
    id: 'SEC-102',
    title: 'About Us & Heritage Architecture',
    slug: 'about-us-heritage-architecture',
    description: 'Traditional Nepali timber craftsmanship, handcrafted furniture, and organic garden surroundings.',
    status: GallerySectionStatus.ACTIVE,
    mediaIds: ['MED-102', 'MED-103', 'MED-107'],
    sortOrder: 2,
    createdAt: '2026-09-02T11:00:00Z',
  },
  {
    id: 'SEC-103',
    title: 'Rooms & Luxury Accommodations',
    slug: 'rooms-luxury-accommodations',
    description: 'Master suites, riverside balconies, plush king beds, and ensuite hot rainfall showers.',
    status: GallerySectionStatus.ACTIVE,
    mediaIds: ['MED-101', 'MED-102', 'MED-103', 'MED-104'],
    sortOrder: 3,
    createdAt: '2026-09-02T14:30:00Z',
  },
  {
    id: 'SEC-104',
    title: 'Tandoori Dining & Riverside Restaurant',
    slug: 'tandoori-dining-riverside-restaurant',
    description: 'Authentic clay oven cuisine, open-air riverbank dining tables, and organic buffet spreads.',
    status: GallerySectionStatus.DRAFT,
    mediaIds: ['MED-107', 'MED-105'],
    sortOrder: 4,
    createdAt: '2026-09-03T09:15:00Z',
  },
];

function notifyGalleryUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(GALLERY_SECTIONS_UPDATED_EVENT));
  }
}

export function getStoredGallerySections(): GallerySectionItem[] {
  if (typeof window === 'undefined') return initialGallerySections;
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to read gallery sections from localStorage:', err);
  }
  return initialGallerySections;
}

export function saveStoredGallerySections(sections: GallerySectionItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(sections));
    notifyGalleryUpdate();
  } catch (err) {
    console.error('Failed to save gallery sections to localStorage:', err);
  }
}

export async function fetchGallerySections(
  status?: string,
  search?: string
): Promise<GallerySectionItem[]> {
  let list = getStoredGallerySections();

  if (status && status !== 'ALL') {
    list = list.filter((s) => s.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }

  // Populate media items from centralized Media storage
  const allMedia = getStoredMedia();
  return list.map((sec) => ({
    ...sec,
    mediaItems: sec.mediaIds
      .map((id) => allMedia.find((m) => m.id === id || m.url === id))
      .filter((m): m is NonNullable<typeof m> => !!m),
  }));
}

export async function createGallerySectionApi(
  input: CreateGallerySectionInput
): Promise<GallerySectionItem> {
  const current = getStoredGallerySections();
  const slug = (input.slug || input.title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const newSection: GallerySectionItem = {
    id: `SEC-${Math.floor(100 + Math.random() * 900)}`,
    title: input.title.trim(),
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    description: input.description?.trim(),
    status: input.status,
    mediaIds: input.mediaIds || [],
    sortOrder: current.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newSection, ...current];
  saveStoredGallerySections(updated);
  return newSection;
}

export async function updateGallerySectionApi(
  id: string,
  input: Partial<CreateGallerySectionInput>
): Promise<GallerySectionItem> {
  const current = getStoredGallerySections();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error('Gallery Section not found');
  }

  const updatedSection: GallerySectionItem = {
    ...current[index],
    title: input.title !== undefined ? input.title.trim() : current[index].title,
    description: input.description !== undefined ? input.description.trim() : current[index].description,
    status: input.status || current[index].status,
    mediaIds: input.mediaIds !== undefined ? input.mediaIds : current[index].mediaIds,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedSection;
  saveStoredGallerySections([...current]);
  return updatedSection;
}

export async function deleteGallerySectionApi(id: string): Promise<boolean> {
  const current = getStoredGallerySections();
  saveStoredGallerySections(current.filter((s) => s.id !== id));
  return true;
}
