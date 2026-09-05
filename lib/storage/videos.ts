import { VideoItem, VideoPlatform, VideoStatus, VideoCategory } from '../types/video';

const VIDEOS_STORAGE_KEY = 'motimahal_admin_videos_v1';
export const VIDEOS_UPDATED_EVENT = 'motimahal_videos_updated';

export const initialVideos: VideoItem[] = [
  {
    id: 'VID-101',
    title: 'Motimahal Lodge Aerial Drone & Narayani Riverfront Tour',
    description: 'Breathtaking 4K drone cinematography capturing the tranquil riverside views, lush garden grounds, and luxury suites of Motimahal Lodge.',
    category: VideoCategory.VIRTUAL_TOUR,
    platform: VideoPlatform.YOUTUBE,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailMediaId: 'MED-105',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    status: VideoStatus.PUBLISHED,
    orderIndex: 1,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'VID-102',
    title: 'Chitwan Elephant & Jeep Safari Reels Highlight',
    description: 'Short dynamic reel documenting guest jungle safari adventures in Chitwan National Park.',
    category: VideoCategory.JUNGLE_SAFARI,
    platform: VideoPlatform.INSTAGRAM,
    videoUrl: 'https://www.instagram.com/reel/C3x9L0PvtZa/',
    thumbnailMediaId: 'MED-106',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    status: VideoStatus.PUBLISHED,
    orderIndex: 2,
    createdAt: '2026-09-02T14:30:00Z',
    updatedAt: '2026-09-02T14:30:00Z',
  },
  {
    id: 'VID-103',
    title: 'Chef Special Clay Oven Tandoori Cooking Video',
    description: 'Behind-the-scenes video with our master chef preparing signature authentic Tandoori dishes in the clay oven.',
    category: VideoCategory.LODGE_DINING,
    platform: VideoPlatform.FACEBOOK,
    videoUrl: 'https://www.facebook.com/watch/?v=1234567890',
    thumbnailMediaId: 'MED-107',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    status: VideoStatus.PUBLISHED,
    orderIndex: 3,
    createdAt: '2026-09-03T09:15:00Z',
    updatedAt: '2026-09-03T09:15:00Z',
  },
  {
    id: 'VID-104',
    title: 'Deluxe Room & Cottage Interior Architecture Showcase',
    description: 'Detailed walk-through tour showcasing room amenities, plush bedding, modern bathrooms, and private balconies.',
    category: VideoCategory.RESORT_OVERVIEW,
    platform: VideoPlatform.VIMEO,
    videoUrl: 'https://vimeo.com/76979871',
    thumbnailMediaId: 'MED-101',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    status: VideoStatus.DRAFT,
    orderIndex: 4,
    createdAt: '2026-09-04T16:20:00Z',
    updatedAt: '2026-09-04T16:20:00Z',
  },
];

export function detectVideoPlatform(url: string): VideoPlatform {
  if (!url) return VideoPlatform.YOUTUBE;
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return VideoPlatform.YOUTUBE;
  if (lower.includes('instagram.com')) return VideoPlatform.INSTAGRAM;
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) return VideoPlatform.FACEBOOK;
  if (lower.includes('tiktok.com')) return VideoPlatform.TIKTOK;
  if (lower.includes('vimeo.com')) return VideoPlatform.VIMEO;
  return VideoPlatform.DIRECT_OTHER;
}

export function getVideos(): VideoItem[] {
  if (typeof window === 'undefined') return initialVideos;
  try {
    const raw = localStorage.getItem(VIDEOS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(initialVideos));
      return initialVideos;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialVideos;
  } catch (error) {
    console.error('Error reading videos from localStorage:', error);
    return initialVideos;
  }
}

export function saveVideos(videos: VideoItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
    window.dispatchEvent(new Event(VIDEOS_UPDATED_EVENT));
  } catch (error) {
    console.error('Error saving videos to localStorage:', error);
  }
}
