import { VideoItem, VideoPlatform } from '../types/video';

export const VIDEOS_UPDATED_EVENT = 'motimahal_videos_updated';

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

export function getStoredVideos(): VideoItem[] {
  return [];
}

export function saveStoredVideos(_videos: VideoItem[]): void {}
