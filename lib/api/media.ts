import { MediaItem, MediaDocumentType, MediaEntityType, MediaUsageRef } from '../types/media';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500';
const MEDIA_STORAGE_KEY = 'motimahal_admin_media_v1';
export const MEDIA_UPDATED_EVENT = 'motimahal_media_updated';

export const mockInitialMedia: MediaItem[] = [
  {
    id: 'MED-101',
    name: 'river-view-suite-master.jpg',
    originalFileName: 'river-view-suite-master.jpg',
    mimeType: 'image/jpeg',
    documentType: MediaDocumentType.IMAGE,
    entityType: MediaEntityType.ROOM,
    entityId: 'RM-101',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    sizeBytes: 1450000,
    widthPx: 1920,
    heightPx: 1080,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'MED-102',
    name: 'heritage-garden-room.jpg',
    originalFileName: 'heritage-garden-room.jpg',
    mimeType: 'image/jpeg',
    documentType: MediaDocumentType.IMAGE,
    entityType: MediaEntityType.ROOM,
    entityId: 'RM-102',
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    sizeBytes: 1120000,
    widthPx: 1920,
    heightPx: 1080,
    createdAt: '2026-09-01T11:15:00Z',
  },
  {
    id: 'MED-103',
    name: 'executive-family-cottage.jpg',
    originalFileName: 'executive-family-cottage.jpg',
    mimeType: 'image/jpeg',
    documentType: MediaDocumentType.IMAGE,
    entityType: MediaEntityType.ROOM,
    entityId: 'RM-103',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    sizeBytes: 2240000,
    widthPx: 1920,
    heightPx: 1080,
    createdAt: '2026-09-02T09:30:00Z',
  },
  {
    id: 'MED-104',
    name: 'standard-twin-room.jpg',
    originalFileName: 'standard-twin-room.jpg',
    mimeType: 'image/jpeg',
    documentType: MediaDocumentType.IMAGE,
    entityType: MediaEntityType.ROOM,
    entityId: 'RM-104',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    sizeBytes: 980000,
    widthPx: 1920,
    heightPx: 1080,
    createdAt: '2026-09-02T14:20:00Z',
  },
  {
    id: 'MED-105',
    name: 'riverside-sunset-terrace.jpg',
    originalFileName: 'riverside-sunset-terrace.jpg',
    mimeType: 'image/jpeg',
    documentType: MediaDocumentType.IMAGE,
    entityType: MediaEntityType.GALLERY,
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    sizeBytes: 1840000,
    widthPx: 1920,
    heightPx: 1080,
    createdAt: '2026-09-03T16:00:00Z',
  },
  {
    id: 'MED-106',
    name: 'chitwan-jungle-safari.jpg',
    originalFileName: 'chitwan-jungle-safari.jpg',
    mimeType: 'image/jpeg',
    documentType: MediaDocumentType.IMAGE,
    entityType: MediaEntityType.GALLERY,
    url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    sizeBytes: 1650000,
    widthPx: 1920,
    heightPx: 1080,
    createdAt: '2026-09-03T17:45:00Z',
  },
  {
    id: 'MED-107',
    name: 'tandoori-dining-hall.jpg',
    originalFileName: 'tandoori-dining-hall.jpg',
    mimeType: 'image/jpeg',
    documentType: MediaDocumentType.IMAGE,
    entityType: MediaEntityType.GENERAL,
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    sizeBytes: 1320000,
    widthPx: 1920,
    heightPx: 1080,
    createdAt: '2026-09-04T08:10:00Z',
  },
  {
    id: 'MED-108',
    name: 'lodge-swimming-pool.jpg',
    originalFileName: 'lodge-swimming-pool.jpg',
    mimeType: 'image/jpeg',
    documentType: MediaDocumentType.IMAGE,
    entityType: MediaEntityType.GALLERY,
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    sizeBytes: 2050000,
    widthPx: 1920,
    heightPx: 1080,
    createdAt: '2026-09-04T12:00:00Z',
  },
];

function notifyMediaUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MEDIA_UPDATED_EVENT));
  }
}

export function getStoredMedia(): MediaItem[] {
  if (typeof window === 'undefined') return mockInitialMedia;
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to read media from localStorage:', err);
  }
  return mockInitialMedia;
}

export function saveStoredMedia(items: MediaItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
    notifyMediaUpdate();
  } catch (err) {
    console.error('Failed to save media to localStorage:', err);
  }
}

export async function fetchMediaList(
  documentType?: string,
  search?: string
): Promise<MediaItem[]> {
  try {
    const query = new URLSearchParams();
    if (documentType && documentType !== 'ALL') query.append('documentType', documentType);
    if (search) query.append('search', search);

    const res = await fetch(`${API_BASE_URL}/api/v1/media?${query.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const result = await res.json();
      if (result && result.success && Array.isArray(result.data)) {
        saveStoredMedia(result.data);
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Backend Media API connection unavailable, fallback to local storage', error);
  }

  let list = getStoredMedia();
  if (documentType && documentType !== 'ALL') {
    list = list.filter((m) => m.documentType === documentType);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.originalFileName.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function uploadMediaApi(
  file: File,
  documentType: MediaDocumentType = MediaDocumentType.IMAGE,
  entityType: MediaEntityType = MediaEntityType.GENERAL,
  entityId?: string
): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  formData.append('entityType', entityType);
  if (entityId) formData.append('entityId', entityId);

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/media/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (res.ok && result.success && result.data) {
      const current = getStoredMedia();
      saveStoredMedia([result.data, ...current]);
      return result.data;
    }
  } catch (err) {
    console.warn('Backend Media Upload API unavailable, fallback to local mock file persistence', err);
  }

  // Local fallback persistence
  const objectUrl = URL.createObjectURL(file);
  const newMedia: MediaItem = {
    id: `MED-${Math.floor(100 + Math.random() * 900)}`,
    name: file.name.toLowerCase().replace(/\s+/g, '-'),
    originalFileName: file.name,
    mimeType: file.type || 'image/jpeg',
    documentType: file.type.startsWith('video/') ? MediaDocumentType.VIDEO : MediaDocumentType.IMAGE,
    entityType,
    entityId,
    url: objectUrl,
    sizeBytes: file.size,
    createdAt: new Date().toISOString(),
  };

  const current = getStoredMedia();
  const updated = [newMedia, ...current];
  saveStoredMedia(updated);
  return newMedia;
}

export async function deleteMediaApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/media/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const current = getStoredMedia();
      saveStoredMedia(current.filter((m) => m.id !== id));
      return true;
    }
  } catch (err) {
    console.warn('Backend Media API connection unavailable, fallback to local delete', err);
  }

  const current = getStoredMedia();
  saveStoredMedia(current.filter((m) => m.id !== id));
  return true;
}

export async function updateMediaMetadataApi(
  id: string,
  metadata: {
    name?: string;
    originalFileName?: string;
    entityType?: MediaEntityType;
    entityId?: string;
  }
): Promise<MediaItem> {
  const current = getStoredMedia();
  const index = current.findIndex((m) => m.id === id);
  if (index === -1) {
    throw new Error('Media asset not found');
  }

  const updatedItem: MediaItem = {
    ...current[index],
    name: metadata.name ? metadata.name.trim() : current[index].name,
    originalFileName: metadata.originalFileName ? metadata.originalFileName.trim() : current[index].originalFileName,
    entityType: metadata.entityType || current[index].entityType,
    entityId: metadata.entityId !== undefined ? metadata.entityId : current[index].entityId,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedItem;
  saveStoredMedia([...current]);
  return updatedItem;
}

export async function replaceMediaFileApi(id: string, file: File): Promise<MediaItem> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds maximum limit of 10MB');
  }

  const current = getStoredMedia();
  const index = current.findIndex((m) => m.id === id);
  if (index === -1) {
    throw new Error('Media asset not found');
  }

  const objectUrl = URL.createObjectURL(file);
  const updatedItem: MediaItem = {
    ...current[index],
    originalFileName: file.name,
    mimeType: file.type || (file.name.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'),
    documentType: file.type.startsWith('video/') || file.name.endsWith('.mp4') ? MediaDocumentType.VIDEO : MediaDocumentType.IMAGE,
    url: objectUrl,
    sizeBytes: file.size,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedItem;
  saveStoredMedia([...current]);
  return updatedItem;
}

export function checkMediaUsage(media: MediaItem): MediaUsageRef[] {
  const usageRefs: MediaUsageRef[] = [];
  if (typeof window === 'undefined') return usageRefs;

  // Check Rooms
  try {
    const roomsRaw = localStorage.getItem('motimahal_admin_rooms_v1');
    if (roomsRaw) {
      const rooms = JSON.parse(roomsRaw);
      if (Array.isArray(rooms)) {
        rooms.forEach((room: { id: string; name: string; imageUrl?: string; galleryImages?: string[] }) => {
          if (room.imageUrl === media.url || (room.galleryImages && room.galleryImages.includes(media.url))) {
            usageRefs.push({
              entityType: 'Room',
              entityId: room.id,
              entityTitle: room.name,
            });
          }
        });
      }
    }
  } catch {
    // Ignore storage parse error
  }

  return usageRefs;
}
